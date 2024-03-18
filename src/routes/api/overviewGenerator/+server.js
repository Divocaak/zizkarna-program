import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';
import path from 'path';

const outputPath = "dynamic/generator";

// 30
const frameRate = 1;
const w = 1080;
const h = 1920;

const crossfadeTime = .1;
const fadeTime = .8;
const sectionLen = 2;

const eventIn = 0;
const eventContent = eventIn + fadeTime;
const eventOut = eventContent + sectionLen;
const eventEnd = eventOut + fadeTime;

const bandIn = eventOut + crossfadeTime;
const bandContent = bandIn + fadeTime;
const bandOut = bandContent + sectionLen;
const bandEnd = bandOut + fadeTime;

const zzIn = bandOut + crossfadeTime;
const zzContent = zzIn + fadeTime;

const duration = zzContent + sectionLen;

export async function POST({ request }) {

    registerFont(path.resolve("./vidGenAssets/neue.otf"), { family: 'Neue Machina Regular' });
    registerFont(path.resolve("./vidGenAssets/karla.ttf"), { family: 'Karla Regular' });
    ffmpeg.setFfmpegPath(ffmpegStatic);

    const frameCount = Math.floor(duration * frameRate);
    const canvas = new Canvas(w, h);
    const context = canvas.getContext('2d');

    const data = await request.json();

    const eventsTexts = data.events.map(eventData => ({
        date: getWrappedText(eventData.date, 130, context, 80),
        label: getWrappedText(eventData.label, 130, context, 80),
        past: eventData.past
    }));

    /* const eventLabelWrapped = getWrappedText(data.eventLabel, 130, context, 80);
    const eventTagsWrapped = getWrappedText(data.eventTags, 200, context, 50);
    const poster = await loadImage(`dynamic/events/${data.eventId}.jpg`);
    const posterDimensions = getImgDimensions(poster, "contain", 1080, 1500);
    
    const bandLabelWrapped = getWrappedText(data.bandLabel, 120, context, 70);
    const bandDescWrapped = getWrappedText(data.bandDesc, 250, context, 50);
    const bandTagsWrapped = getWrappedText(data.bandTags, 200, context, 50);
    const bandStageTimeWrapped = getWrappedText(data.bandStageTime, 300, context, 40);
    const bandImage = await loadImage(`dynamic/bands/${data.bandImage}`);
    const bandImageDimensions = getImgDimensions(bandImage, "contain", 1080, 1500);

    const dateWrapped = getWrappedText(data.date, 500, context, 90);
    const doorsWrapped = getWrappedText(data.doors, 500, context, 90);
    const ticketsWrapped = data.tickets ? getWrappedText(data.tickets, 100, context, 90) : null; */
    const logo = await loadImage("./vidGenAssets/logo_transparent.png");

    // Clean up the temporary directories first
    for (const path of [outputPath]) {
        if (fs.existsSync(path)) await fs.promises.rm(path, { recursive: true });
        await fs.promises.mkdir(path, { recursive: true });
    }

    /* if (data.testFrame != null) {
        context.fillStyle = '#1f1f1f';
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        const testFrameTime = data.testFrame == "event" ? eventContent : bandContent;
        renderFrame(context, testFrameTime, poster, posterDimensions, eventLabelWrapped, eventTagsWrapped, bandLabelWrapped, bandDescWrapped, bandImage, bandImageDimensions, bandTagsWrapped, bandStageTimeWrapped);
    
        const outputFile = `${outputPath}/testFrame.png`;
        const output = canvas.toBuffer('image/png');
        await fs.promises.writeFile(outputFile, output);
    
        return new Response(JSON.stringify({ path: outputFile, img: true }, { status: 200 }));
    } */

    // Render each frame
    for (let i = 0; i < frameCount; i++) {
        const time = i / frameRate;
    
        // clear canvas
        // context.fillStyle = '#1f1f1f';
        context.fillStyle = 'green';
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        renderFrame(context, time, eventsTexts);
    
        // Store the image in the directory where it can be found by FFmpeg
        const output = canvas.toBuffer('image/png');
        const paddedNumber = String(i).padStart(4, '0');
        await fs.promises.writeFile(`${outputPath}/frame-${paddedNumber}.png`, output);
    }
    
    const outputFile = `${outputPath}/video.mp4`;
    await stitchFramesToVideo(
        `${outputPath}/frame-%04d.png`,
        outputFile,
        duration,
        frameRate,
    );

    return new Response(JSON.stringify({ path: "outputFile", img: false }, { status: 200 }));
}

function renderFrame(context, time, eventsTexts) {

    context.fillStyle = "#d4d4d4";

    let anchorY = 100;
    eventsTexts.forEach((eventText) =>{
        /* const dateX = interpolateKeyframes([
            { time: 0, value: 50 },
            { time: eventEnd, value: -1500 }
        ], time);
        const dateY = interpolateKeyframes([
            { time: 0, value: -200 },
            { time: eventContent, value: 200 }
        ], time); */
        context.font = "40px 'Karla Regular'";
        context.textAlign = "left";
        eventText.date.forEach(function (item) {
            context.fillText(item[0], 100, anchorY + item[1]);
        });
        
        context.font = "50px 'Neue Machina Regular'";
        eventText.label.forEach(function (item) {
            context.fillText(item[0], 100, anchorY + 50 + item[1]);
        });

        anchorY += 300;
    });

    /* if (logo != null) {
        const logoY = interpolateKeyframes([
            { time: zzIn + .2, value: -1080 },
            { time: zzContent, value: 150 }
        ], time);
        context.drawImage(logo, 0, logoY, 1080, 1080);
    } */
}

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

        if (testLineWidth <= maxWidth) {
            line = testLine;
            return;
        }

        lineArray.push([line.trim(), y]);
        line = word + ' ';
        y += lineHeight;
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
    t = easeInOutBack(t);

    return keyframe1.value + (keyframe2.value - keyframe1.value) * t;
}

function easeInOutBack(x) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

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