import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';

export async function POST({ request }) {

    const data = await request.json();
    const event = data.event;
    const band = data.band;
    const eventTags = data.eventTags;


    const canvas = new Canvas(1080, 1920);
    const context = canvas.getContext('2d');

    const duration = 12;
    const frameRate = 1;
    const frameCount = Math.floor(duration * frameRate);

    const outputPath = "dynamic/generator";


    ffmpeg.setFfmpegPath(ffmpegStatic);

    // Clean up the temporary directories first
    for (const path of [outputPath]) {
        if (fs.existsSync(path)) await fs.promises.rm(path, { recursive: true });
        await fs.promises.mkdir(path, { recursive: true });
    }

    const eventLabelWrapped = getWrappedText(event.label, 180, context, 70);

    const poster = await loadImage(`dynamic/events/${event.id}.jpg`);
    const posterDimensions = getImgDimensions(poster, "contain", 1080, 1500);

    const bandLabelWrapped = getWrappedText(band.label, 190, context, 60);
    const bandDescWrapped = getWrappedText(band.description, 250, context, 50);

    const bandImage = await loadImage(`dynamic/bands/${band.id}/${band.imgs[0]}`);
    const bandImageDimensions = getImgDimensions(bandImage, "contain", 1080, 1500);

    const bandTagsWrapped = getWrappedText(getTagsString(band.tags), 300, context, 40);

    // Render each frame
    for (let i = 0; i < frameCount; i++) {
        const time = i / frameRate;

        // clear canvas
        /* context.fillStyle = '#1f1f1f'; */
        context.fillStyle = 'darkslategray';
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderFrame(context, time, poster, posterDimensions, eventLabelWrapped, bandLabelWrapped, bandDescWrapped, bandImage, bandImageDimensions, bandTagsWrapped);

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

function renderFrame(context, time, poster, posterDimensions, eventLabel, bandLabel, bandDesc, bandImage, bandImageDimensions, bandTags) {

    context.fillStyle = "#d4d4d4";

    /* TODO easing (work with greater framerate */
    // { time: 3, value: 200, easing: 'cubic-in-out' },
    const eventLabelX = interpolateKeyframes([
        { time: 0, value: 140 },
        { time: 2.5, value: 140 },
        { time: 3, value: 140 },
        { time: 5, value: -1400 }
    ], time);
    const eventLabelY = interpolateKeyframes([
        { time: 0, value: -200 },
        { time: 2.5, value: 250 }
    ], time);
    context.font = "70px serif";
    eventLabel.forEach(function (item) {
        context.fillText(item[0], eventLabelX, eventLabelY + item[1]);
    });

    const posterX = interpolateKeyframes([
        { time: 0, value: 0 },
        { time: 2.5, value: 0 },
        { time: 3, value: 0 },
        { time: 5, value: -1400 }
    ], time);
    const posterY = interpolateKeyframes([
        { time: 0, value: 2000 },
        { time: 2.5, value: 500 }
    ], time);
    context.drawImage(poster, posterX, posterY, posterDimensions.w, posterDimensions.h);

    const bandLabelX = interpolateKeyframes([
        { time: 3.5, value: 1080 },
        { time: 5, value: 140 }
    ], time);
    context.font = "60px serif";
    bandLabel.forEach(function (item) {
        context.fillText(item[0], bandLabelX, 150 + item[1]);
    });

    /* TODO event tags (after band tags, same logic) */

    const bandDescX = interpolateKeyframes([
        { time: 4, value: 1080 },
        { time: 5.5, value: 100 }
    ], time);
    /* TODO different font for description */
    context.font = "40px serif";
    bandDesc.forEach(function (item) {
        context.fillText(item[0], bandDescX, 300 + item[1]);
    });

    const bandTagsX = interpolateKeyframes([
        { time: 3.5, value: 1080 },
        { time: 5, value: 140 }
    ], time);
    context.font = "30px serif";
    bandTags.forEach(function (item) {
        context.fillText(item[0], bandTagsX, 1000 + item[1]);
    });

    const bandImageX = interpolateKeyframes([
        { time: 4.5, value: 1080 },
        { time: 6, value: 0 }
    ], time);
    context.drawImage(bandImage, bandImageX, 1920 - bandImageDimensions.h, bandImageDimensions.w, bandImageDimensions.h);
}

function getTagsString(tags) { return tags.map(tag => tag.label).join('').replaceAll("////", "//"); }

function getImgDimensions(img, type, maxWidth, maxHeight) {
    const imgRatio = img.height / img.width;
    const winRatio = maxHeight / maxWidth;
    /* landscape img */
    if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) return { w: maxWidth, h: maxWidth * imgRatio };
    /* portrait img */
    if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) return { w: maxWidth * winRatio / imgRatio, h: maxHeight };
}

function getWrappedText(text, maxWidth, context, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let lineArray = [];
    let y = 0;

    words.forEach(word => {
        let testLine = line + word + ' ';
        let testLineWidth = context.measureText(testLine).width;
        if (testLineWidth > maxWidth) {
            lineArray.push([line.trim(), y]);
            line = word + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    });

    lineArray.push([line.trim(), y]);

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