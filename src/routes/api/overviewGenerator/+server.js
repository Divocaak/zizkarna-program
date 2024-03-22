import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';
import path from 'path';

const outputPath = "dynamic/generator";

// 30
const frameRate = 10;
const w = 1080;
const h = 1920;

const duration = 15;

const yBorder = 250;

const eventStartShift = .5;
const eventEndShift = .4;

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

    const firstOutDuration = eventsTexts[0].length * eventEndShift;
    const firstHalfTimes = {
        inStart: 0,
        inDuration: eventsTexts[0].length * eventStartShift,
        outStart: duration - firstOutDuration,
        outDuration: firstOutDuration
    };
    console.log(`BEFORE SPLIT CHECK first (${eventsTexts[0].length} events to display): `);
    console.log(firstHalfTimes);

    if (data.halfSplit) {
        
        const secondInDuration = eventsTexts[1].length * eventStartShift
        const secondOutDuration = eventsTexts[1].length * eventEndShift;
        
        const contentLenPerSection = (duration - firstHalfTimes.inDuration - (data.halfSplit ? secondOutDuration : firstHalfTimes.outDuration) - secondInDuration) / 2;
        console.log("===================");
        console.log(`contentLenPerSection: ${contentLenPerSection}\n`);
        
        firstHalfTimes.outStart = firstHalfTimes.inStart + firstHalfTimes.inDuration + contentLenPerSection;

        var secondHalfTimes = {
            inStart: firstHalfTimes.outStart,
            inDuration: secondInDuration,
            outStart: firstHalfTimes.outStart + firstHalfTimes.outDuration + contentLenPerSection,
            outDuration: secondOutDuration
        };
        console.log(`first (${eventsTexts[0].length} events to display): `);
        console.log(firstHalfTimes);
        console.log("---------------------");
        console.log(`second (${eventsTexts[1].length}): `);
        console.log(secondHalfTimes);

        console.log("===================");
        console.log(`first content len: ${firstHalfTimes.outStart - firstHalfTimes.inStart - firstHalfTimes.inDuration}`);
        console.log(`second content len: ${secondHalfTimes.outStart - secondHalfTimes.inStart - secondHalfTimes.inDuration}`);
    }

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
    if (halfSplit) {
        renderAllTexts(context, time, dimPast, eventsTexts[1], eventBottomPadding[1], halfSplit, true);
    }
}

function renderAllTexts(context, time, dimPast, texts, eventBottomPadding, halfSplit = false, secondHalf = false) {
    const secondHalfFadeInStart = 7.5;
    const firstHalfFadeOutStart = 7.5;
    let currentTextFadeInStart = (!halfSplit || !secondHalf) ? 0 : secondHalfFadeInStart;
    let currentTextFadeOutStart = (!halfSplit || !secondHalf) ? firstHalfFadeOutStart : 15;

    let currY = yBorder;

    const dateToLabelSpacer = 60;
    const lineStartX = w / 2;
    const xPosition = 50;

    context.lineWidth = 3;

    texts.forEach((eventText) => {
        const lineY = currY - 40;

        const textFadeInStart = currentTextFadeInStart;
        const textFadeInEnd = textFadeInStart + 1;
        const textFadeOutStart = currentTextFadeOutStart;
        const textFadeOutEnd = textFadeOutStart + 1;

        const lineFadeInStart = textFadeInStart + .35;
        const lineFadeInEnd = lineFadeInStart + .4;
        const lineFadeOutStart = textFadeOutStart;
        const lineFadeOutEnd = lineFadeOutStart + .4;

        const dateFadeInStart = textFadeInStart + .1;
        const dateFadeInEnd = textFadeInEnd + .1;
        const dateFadeOutStart = textFadeOutStart + .1;
        const dateFadeOutEnd = textFadeOutEnd + .1;

        context.fillStyle = (eventText.past && dimPast) ? "#7f7f7f" : "#d4d4d4";
        context.strokeStyle = (eventText.past && dimPast) ? "#7f7f7f" : "#d4d4d4";

        /* TODO find easing */
        const lineLeftX = interpolateKeyframes([
            { time: lineFadeInStart, value: lineStartX },
            { time: lineFadeInEnd, value: xPosition },
            { time: lineFadeOutStart, value: xPosition },
            { time: lineFadeOutEnd, value: lineStartX }
        ], time);
        const lineRightX = interpolateKeyframes([
            { time: lineFadeInStart, value: lineStartX },
            { time: lineFadeInEnd, value: w - xPosition },
            { time: lineFadeOutStart, value: w - xPosition },
            { time: lineFadeOutEnd, value: lineStartX }
        ], time);
        context.beginPath();
        context.moveTo(lineStartX, lineY);
        context.lineTo(lineLeftX, lineY);
        context.moveTo(lineStartX, lineY);
        context.lineTo(lineRightX, lineY);
        context.stroke();

        const dateX = interpolateKeyframes([
            { time: dateFadeInStart, value: 1300 },
            { time: dateFadeInEnd, value: xPosition },
            { time: dateFadeOutStart, value: xPosition },
            { time: dateFadeOutEnd, value: -1000 }
        ], time, "inOutBack");
        context.font = "40px 'Karla Regular'";
        context.textAlign = "left";
        eventText.date.forEach(function (item) {
            context.fillText(item[0], dateX, currY + item[1]);
        });

        const labelX = interpolateKeyframes([
            { time: textFadeInStart, value: 1300 },
            { time: textFadeInEnd, value: xPosition },
            { time: textFadeOutStart, value: xPosition },
            { time: textFadeOutEnd, value: -1000 },
        ], time, "inOutBack");
        context.font = "50px 'Neue Machina Regular'";
        eventText.label.forEach(function (item) {
            context.fillText(item[0], labelX, currY + dateToLabelSpacer + item[1]);
        });

        currY += eventBottomPadding + eventText.height;
        currentTextFadeInStart += eventStartShift;
        currentTextFadeOutStart += eventEndShift;
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