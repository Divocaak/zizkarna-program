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

const duration = 4;

const yBorder = 250;

export async function POST({ request }) {

    registerFont(path.resolve("./vidGenAssets/neue.otf"), { family: 'Neue Machina Regular' });
    registerFont(path.resolve("./vidGenAssets/karla.ttf"), { family: 'Karla Regular' });
    ffmpeg.setFfmpegPath(ffmpegStatic);

    const frameCount = Math.floor(duration * frameRate);
    const canvas = new Canvas(w, h);
    const context = canvas.getContext('2d');

    const data = await request.json();

    let textsHeight = 0;
    const eventsTexts = [];
    data.events.forEach(eventData => {
        const { date, label, past } = eventData;
        const dateLineHeight = 40;
        const labelLineHeight = 60;
        const dateWrapped = getWrappedText(date, 200, context, dateLineHeight);
        const labelWrapped = getWrappedText(label, 170, context, labelLineHeight);
        const height = (dateWrapped.length * dateLineHeight) + (labelWrapped.length * labelLineHeight);
        textsHeight += height;

        eventsTexts.push({ date: dateWrapped, label: labelWrapped, height, past });
    });
    const eventBottomPadding = (h - yBorder - textsHeight) / eventsTexts.length;

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
    const grad0 = await loadImage("./vidGenAssets/grads/grad0.png");
    const grad1 = await loadImage("./vidGenAssets/grads/grad1.png");
    const grad2 = await loadImage("./vidGenAssets/grads/grad2.png");
    const grad3 = await loadImage("./vidGenAssets/grads/grad3.png");
    //const logo = await loadImage("./vidGenAssets/logo_transparent.png");

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
        /* context.fillStyle = '#1f1f1f'; */
        context.fillStyle = "green";
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderFrame(context, time, eventsTexts, eventBottomPadding, grad0, grad1, grad2, grad3);

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

function renderFrame(context, time, eventsTexts, eventBottomPadding, grad0, grad1, grad2, grad3) {

    context.fillStyle = "#d4d4d4";
    context.lineWidth = 3;
    context.strokeStyle = "#d4d4d4";

    const grad0X = interpolateKeyframes([
        { time: 0, value: Math.floor(Math.random() * w)},
        { time: duration, value: Math.floor(Math.random() * w)}
    ], time);
    const grad0Y = interpolateKeyframes([
        { time: 0, value: Math.floor(Math.random() * h)},
        { time: duration, value: Math.floor(Math.random() * h)}
    ], time);
    const grad1X = interpolateKeyframes([
        { time: 0, value: Math.floor(Math.random() * w)},
        { time: duration, value: Math.floor(Math.random() * w)}
    ], time);
    const grad1Y = interpolateKeyframes([
        { time: 0, value: Math.floor(Math.random() * h)},
        { time: duration, value: Math.floor(Math.random() * h)}
    ], time);
    const grad2X = interpolateKeyframes([
        { time: 0, value: Math.floor(Math.random() * w)},
        { time: duration, value: Math.floor(Math.random() * w)}
    ], time);
    const grad2Y = interpolateKeyframes([
        { time: 0, value: Math.floor(Math.random() * h)},
        { time: duration, value: Math.floor(Math.random() * h)}
    ], time);
    const grad3X = interpolateKeyframes([
        { time: 0, value: Math.floor(Math.random() * w)},
        { time: duration, value: Math.floor(Math.random() * w)}
    ], time);
    const grad3Y = interpolateKeyframes([
        { time: 0, value: Math.floor(Math.random() * h)},
        { time: duration, value: Math.floor(Math.random() * h)}
    ], time);

    context.drawImage(grad0, grad0X, grad0Y, 512, 384);
    context.drawImage(grad1, grad1X, grad1Y, 512, 384);
    context.drawImage(grad2, grad2X, grad2Y, 512, 384);
    context.drawImage(grad3, grad3X, grad3Y, 512, 384);

    let currTime = 0;

    let currY = yBorder;
    const dateToLabelSpacer = 60;

    eventsTexts.forEach((eventText) => {
        const lineY = currY - 40;
        const lineStartX = w / 2;
        const lineTimeStart = currTime + .35;
        const lineTimeEnd = lineTimeStart + .4;

        const xPosition = 50;

        const length = currTime + 1;
        
        /* TODO find easing */
        const lineLeftX = interpolateKeyframes([
            { time: lineTimeStart, value: lineStartX },
            { time: lineTimeEnd, value: xPosition }
        ], time);
        const lineRightX = interpolateKeyframes([
            { time: lineTimeStart, value: lineStartX },
            { time: lineTimeEnd, value: w - xPosition }
        ], time);
        context.beginPath();
        context.moveTo(lineStartX, lineY);
        context.lineTo(lineLeftX, lineY);
        context.moveTo(lineStartX, lineY);
        context.lineTo(lineRightX, lineY);
        context.stroke();

        const dateX = interpolateKeyframes([
            { time: currTime + .1, value: 1300 },
            { time: length + .1, value: xPosition }
        ], time, "inOutBack");
        context.font = "40px 'Karla Regular'";
        context.textAlign = "left";
        eventText.date.forEach(function (item) {
            context.fillText(item[0], dateX, currY + item[1]);
        });

        const labelX = interpolateKeyframes([
            { time: currTime, value: 1300 },
            { time: length, value: xPosition }
        ], time, "inOutBack");
        context.font = "50px 'Neue Machina Regular'";
        eventText.label.forEach(function (item) {
            context.fillText(item[0], labelX, currY + dateToLabelSpacer + item[1]);
        });

        currY += eventBottomPadding + eventText.height;
        currTime += .5;
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

function interpolateKeyframes(keyframes, time, easing = null) {

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
    if (easing === "inOutBack") t = easeInOutBack(t);

    return keyframe1.value + (keyframe2.value - keyframe1.value) * t;
}

function easeInOutBack(x) {
    const c1 = 1.70158 * .75;
    const c2 = c1 * 1.525 * .75;

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