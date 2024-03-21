import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';
import path from 'path';

const outputPath = "dynamic/generator";

// 30
const frameRate = 5;
const w = 1080;
const h = 1920;

const duration = 15;

const yBorder = 250;

export async function POST({ request }) {

    registerFont(path.resolve("./vidGenAssets/neue.otf"), { family: 'Neue Machina Regular' });
    registerFont(path.resolve("./vidGenAssets/karla.ttf"), { family: 'Karla Regular' });
    ffmpeg.setFfmpegPath(ffmpegStatic);

    const frameCount = Math.floor(duration * frameRate);
    const canvas = new Canvas(w, h);
    const context = canvas.getContext('2d');

    const data = await request.json();

    let textsHeight = [0, 0];
    const eventsTexts = [[], []];

    const middleIndex = Math.floor(data.events.length / 2);
    const finalMiddleIndex = data.events.length % 2 === 0 ? middleIndex : middleIndex + 1;

    data.events.forEach((eventData, index) => {
        const { date, label, past, tickets } = eventData;
        const dateLineHeight = 40;
        const labelLineHeight = 60;
        const dateWrapped = getWrappedText(date + (tickets != null ? " (předprodej online)" : ""), 200, context, dateLineHeight);
        const labelWrapped = getWrappedText(label, 170, context, labelLineHeight);
        const height = (dateWrapped.length * dateLineHeight) + (labelWrapped.length * labelLineHeight);

        const halfsIndex = !data.halfSplit || (index < finalMiddleIndex && data.halfSplit) ? 0 : 1;
        textsHeight[halfsIndex] += height;
        eventsTexts[halfsIndex].push({ date: dateWrapped, label: labelWrapped, height, past });
    });
    /* TODO if there is still space under the last text, add the space to the top (eg only one event, shift everything more to the center) */
    const eventBottomPadding = [
        ((h - yBorder - textsHeight[0]) / eventsTexts[0].length),
        data.halfSplit ? ((h - yBorder - textsHeight[1]) / eventsTexts[1].length) : null
    ];

    const gradients = [];
    for (let i = 0; i < 4; i++) {
        const sizeFactor = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        const gradW = 512 * sizeFactor;
        const gradH = 384 * sizeFactor;
        gradients.push({
            img: await loadImage(`./vidGenAssets/grads/grad${i}.png`),
            /* TODO subtract half of compted w from x (and h from y ) to preserve visibility */
            xStart: Math.floor(Math.random() * w),
            xEnd: Math.floor(Math.random() * w),
            yStart: Math.floor(Math.random() * h),
            yEnd: Math.floor(Math.random() * h),
            w: gradW,
            h: gradH
        });
    }
    const noise = await loadImage("./vidGenAssets/grads/noise.png");
    const logo = await loadImage("./vidGenAssets/logo_transparent.png");

    // Clean up the temporary directories first
    for (const path of [outputPath]) {
        if (fs.existsSync(path)) await fs.promises.rm(path, { recursive: true });
        await fs.promises.mkdir(path, { recursive: true });
    }

    if (data.testFrame != null) {
        context.fillStyle = '#1f1f1f';
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderFrame(context, 10, eventsTexts, eventBottomPadding, gradients, noise, logo, data.label, data.dimPast, data.halfSplit);

        const outputFile = `${outputPath}/testFrame.png`;
        const output = canvas.toBuffer('image/png');
        await fs.promises.writeFile(outputFile, output);

        return new Response(JSON.stringify({ path: outputFile, img: true }, { status: 200 }));
    }

    // Render each frame
    for (let i = 0; i < frameCount; i++) {
        const time = i / frameRate;

        // clear canvas
        context.fillStyle = '#1f1f1f';
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderFrame(context, time, eventsTexts, eventBottomPadding, gradients, noise, logo, data.label, data.dimPast, data.halfSplit);

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

function renderFrame(context, time, eventsTexts, eventBottomPadding, gradients, noise, logo, label, dimPast, halfSplit) {
    /* TODO find easing */
    /* gradients.forEach(gradient => {
        const x = interpolateKeyframes([
            { time: 0, value: gradient.xStart },
            { time: duration, value: gradient.xEnd }
        ], time);
        const y = interpolateKeyframes([
            { time: 0, value: gradient.yStart },
            { time: duration, value: gradient.yEnd }
        ], time);
        context.drawImage(gradient.img, x, y, w, h);
    });
    context.drawImage(noise, 0, 0, w, h);

    context.drawImage(logo, w - 120, 0, 150, 150);

    context.fillStyle = "#d4d4d4";
    context.font = "80px 'Neue Machina Regular'";
    context.textAlign = "center";
    context.fillText(label, w / 2, 125);
    context.fillText(label, (w / 2) + 2, 125); */

    renderAllTexts(context, time, dimPast, eventsTexts[0], eventBottomPadding[0], halfSplit);
    if(halfSplit){
        renderAllTexts(context, time, dimPast, eventsTexts[1], eventBottomPadding[1], halfSplit, true);
    }
}

function renderAllTexts(context, time, dimPast, texts, eventBottomPadding, halfSplit, secondHalf = false) {
    let currentTextFadeInStart = 0;
    let currentTextFadeOutStart = secondHalf ? 15 : 7.5;

    let currY = yBorder;
    const dateToLabelSpacer = 60;

    texts.forEach((eventText) => {
        context.fillStyle = (eventText.past && dimPast) ? "#7f7f7f" : "#d4d4d4";
        context.strokeStyle = (eventText.past && dimPast) ? "#7f7f7f" : "#d4d4d4";
        context.lineWidth = 3;

        const lineY = currY - 40;
        const lineStartX = w / 2;
        const lineFadeInStart = currentTextFadeInStart + .35;
        const lineFadeInEnd = lineFadeInStart + .4;

        const xPosition = 50;

        const textFadeInEnd = currentTextFadeInStart + 1;

        /* TODO find easing */
        const lineLeftX = interpolateKeyframes([
            { time: lineFadeInStart, value: lineStartX },
            { time: lineFadeInEnd, value: xPosition }
        ], time);
        const lineRightX = interpolateKeyframes([
            { time: lineFadeInStart, value: lineStartX },
            { time: lineFadeInEnd, value: w - xPosition }
        ], time);
        context.beginPath();
        context.moveTo(lineStartX, lineY);
        context.lineTo(lineLeftX, lineY);
        context.moveTo(lineStartX, lineY);
        context.lineTo(lineRightX, lineY);
        context.stroke();

        const dateX = interpolateKeyframes([
            { time: currentTextFadeInStart + .1, value: 1300 },
            { time: textFadeInEnd + .1, value: xPosition }
        ], time, "inOutBack");
        context.font = "40px 'Karla Regular'";
        context.textAlign = "left";
        eventText.date.forEach(function (item) {
            context.fillText(item[0], dateX, currY + item[1]);
        });

        const labelX = interpolateKeyframes([
            { time: currentTextFadeInStart, value: 1300 },
            { time: textFadeInEnd, value: xPosition }
        ], time, "inOutBack");
        context.font = "50px 'Neue Machina Regular'";
        eventText.label.forEach(function (item) {
            context.fillText(item[0], labelX, currY + dateToLabelSpacer + item[1]);
        });

        currY += eventBottomPadding + eventText.height;
        currentTextFadeInStart += .5;
    });
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