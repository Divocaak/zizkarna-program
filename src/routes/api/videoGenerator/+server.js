import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';

export async function POST({ request }) {

    const data = await request.json();
    const event = data.event;
    const band = data.band;

    const canvas = new Canvas(1080, 1920);
    const context = canvas.getContext('2d');

    const duration = 5;
    const frameRate = 1;
    const frameCount = Math.floor(duration * frameRate);

    const outputPath = "dynamic/generator";

    const poster = await loadImage(`dynamic/events/${event.id}.jpg`);

    ffmpeg.setFfmpegPath(ffmpegStatic);

    // Clean up the temporary directories first
    for (const path of [outputPath]) {
        if (fs.existsSync(path)) await fs.promises.rm(path, { recursive: true });
        await fs.promises.mkdir(path, { recursive: true });
    }

    // Render each frame
    for (let i = 0; i < frameCount; i++) {

        const time = i / frameRate;

        // clear canvas
        context.fillStyle = '#1f1f1f';
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderFrame(context, time, poster, event, band);

        // Store the image in the directory where it can be found by FFmpeg
        const output = canvas.toBuffer('image/png');
        const paddedNumber = String(i).padStart(4, '0');
        await fs.promises.writeFile(`${outputPath}/frame-${paddedNumber}.png`, output);
    }

    await stitchFramesToVideo(
        `${outputPath}/frame-%04d.png`,
        `${outputPath}/video.mp4`,
        duration,
        frameRate,
    );

    return new Response(JSON.stringify({ message: outputPath }, { status: 200 }));
}

function renderFrame(context, time, poster, event, band) {

    context.fillStyle = "#d4d4d4";

    // Calculate the x position over time
    const x = interpolateKeyframes([
        // At time 0, we want x to be 100
        { time: 0, value: 100 },
        // At time 1.5, we want x to be 550 (using Cubic easing)
        { time: 1.5, value: 550, easing: 'cubic-in-out' },
        // At time 3, we want x to be 200 (using Cubic easing)
        { time: 3, value: 200, easing: 'cubic-in-out' },
    ], time);

    const eventLabelX = interpolateKeyframes([
        { time: 0, value: 10 },
        { time: 2.5, value: 10 },
        { time: 5, value: 0 }
    ], time);
    const eventLabelY = interpolateKeyframes([
        { time: 0, value: 1920 },
        { time: 2.5, value: 960 }
    ], time);

    const textToDraw = "ČBxHC vol. 3: Melted Ice, Dog Feed, Dezinfekce, Decultivate";
    const maxWidth = 500;
    /* getBestFitFontSize(textToDraw, maxWidth, "serif", context); */

    context.font = "50px serif";

    let wrappedText = textWrap(textToDraw, maxWidth, eventLabelX, eventLabelY, context, 140);
    wrappedText.forEach(function (item) {
        context.fillText(item[0], item[1], item[2]);
    })
    /* context.fillText(textToDraw, eventLabelX, eventLabelY); */

    /* context.drawImage(poster, x, 100, 500, 500); */
}

/* NOTE mby not used */
function getBestFitFontSize(text, maxWidth, fontface, context) {
    var fontSize = 300;
    do {
        fontSize--;
        context.font = fontSize + "px " + fontface;
    } while (context.measureText(text).width > maxWidth)
}

function textWrap(text, maxWidth, x, y, context, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let lineArray = [];

    words.forEach(word => {
        let testLine = line + word + ' ';
        let testLineWidth = context.measureText(testLine).width;
        if (testLineWidth > maxWidth) {
            lineArray.push([line.trim(), x, y]);
            line = word + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    });

    lineArray.push([line.trim(), x, y]);

    return lineArray;
}

function interpolateKeyframes(keyframes, time) {

    const firstKeyframe = keyframes[0];
    if (time < firstKeyframe.time) return firstKeyframe.value;

    const lastKeyframe = keyframes[keyframes.length - 1];
    if (time >= lastKeyframe.time) return lastKeyframe.value;

    let index;
    for (index = 0; index < keyframes.length - 1; index++) {
        if (keyframes[index].time <= time && keyframes[index + 1].time >= time) break;
    }

    const keyframe1 = keyframes[index];
    const keyframe2 = keyframes[index + 1];

    let t = (time - keyframe1.time) / (keyframe2.time - keyframe1.time);

    /* TODO diff approach */
    if (keyframe2.easing === 'expo-out') {
        t = applyExponentialOutEasing(t);
    } else if (keyframe2.easing === 'cubic-in-out') {
        t = applyCubicInOutEasing(t);
    } else {
        // ... Implement more easing functions
    }

    return keyframe1.value + (keyframe2.value - keyframe1.value) * t;
}

const applyExponentialOutEasing = t => t === 1 ? 1 : 1 - 2 ** (-10 * t);
const applyCubicInOutEasing = t => t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2;

async function stitchFramesToVideo(
    framesFilepath,
    outputFilepath,
    duration,
    frameRate,
) {
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(framesFilepath)
            .inputOptions([`-framerate ${frameRate}`])
            .videoCodec('libx264')
            .outputOptions(['-pix_fmt yuv420p'])
            .duration(duration)
            .fps(frameRate)
            .saveToFile(outputFilepath)
            .on('end', () => resolve())
            .on('error', (error) => reject(new Error(error)));
    });
}