import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';
import path from 'path';

const outputPath = "dynamic/generator";

// 30
const frameRate = 30;

const yBorder = 250;

const eventStartShift = .5;
const eventEndShift = .4;

export async function POST({ request }) {

    registerFont(path.resolve("./vidGenAssets/neue.otf"), { family: 'Neue Machina Regular' });
    registerFont(path.resolve("./vidGenAssets/karla.ttf"), { family: 'Karla Regular' });
    ffmpeg.setFfmpegPath(ffmpegStatic);

    const data = await request.json();
    
    const isPoster = data.duration == "a4" || data.duration == "a2";
    const outputDimensions = {
        w: isPoster ? (data.duration == "a2" ? 4961 : 2480) : 1080,
        h: isPoster ? (data.duration == "a2" ? 7016 : 3508) : 1920
    };

    console.log(`isPoster ${isPoster}, duration data: ${data.duration}`)

    const duration = data.duration;

    const frameCount = Math.floor(duration * frameRate);
    const canvas = new Canvas(outputDimensions.w, outputDimensions.h);
    const context = canvas.getContext('2d');

    const textsHeight = [0, 0];
    const eventsTexts = [[], []];

    const middleIndex = Math.floor(data.events.length / 2);
    const finalMiddleIndex = data.events.length % 2 === 0 ? middleIndex : middleIndex + 1;

    const legalHalfSplit = data.halfSplit && data.events.length > 1 && !isPoster;

    data.events.forEach((eventData, index) => {
        const { date, label, past, tickets } = eventData;
        const dateLineHeight = 40;
        const labelLineHeight = 60;
        const dateWrapped = getWrappedText(date + (tickets != null ? " (předprodej online)" : ""), 200, context, dateLineHeight);
        const labelWrapped = getWrappedText(label, 170, context, labelLineHeight);
        const height = (dateWrapped.length * dateLineHeight) + (labelWrapped.length * labelLineHeight);

        const halfsIndex = !legalHalfSplit || (index < finalMiddleIndex && legalHalfSplit) ? 0 : 1;
        textsHeight[halfsIndex] += height;
        eventsTexts[halfsIndex].push({ date: dateWrapped, label: labelWrapped, height, past });
    });

    const usableVerticalSpace = outputDimensions.h - yBorder;
    const eventBottomPadding = [
        ((usableVerticalSpace - textsHeight[0]) / eventsTexts[0].length),
        legalHalfSplit ? ((usableVerticalSpace - textsHeight[1]) / eventsTexts[1].length) : null
    ];

    const firstOutDuration = eventsTexts[0].length * eventEndShift;
    const firstInDuration = eventsTexts[0].length * eventStartShift;
    const firstHalfTimes = {
        inStart: 0,
        outStart: duration - firstOutDuration
    };

    if (legalHalfSplit) {
        const contentLenPerSection = (duration - firstInDuration - (eventsTexts[1].length * (eventEndShift + eventStartShift))) / 2;
        firstHalfTimes.outStart = firstHalfTimes.inStart + firstInDuration + contentLenPerSection;
        var secondHalfTimes = {
            inStart: firstHalfTimes.outStart,
            outStart: firstHalfTimes.outStart + firstOutDuration + contentLenPerSection,
        };
    }

    const gradients = [];
    for (let i = 0; i < 4; i++) {
        const sizeFactor = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        const gradW = 512 * sizeFactor;
        const gradH = 384 * sizeFactor;
        gradients.push({
            img: await loadImage(`./vidGenAssets/grads/grad${i}.png`),
            xStart: Math.floor(Math.random() * (outputDimensions.w + gradW + 1)) - gradW,
            xMid: Math.floor(Math.random() * (outputDimensions.w + gradW + 1)) - gradW,
            xEnd: Math.floor(Math.random() * (outputDimensions.w + gradW + 1)) - gradW,
            yStart: Math.floor(Math.random() * (outputDimensions.h + gradH + 1)) - gradH,
            yMid: Math.floor(Math.random() * (outputDimensions.h + gradH + 1)) - gradH,
            yEnd: Math.floor(Math.random() * (outputDimensions.h + gradH + 1)) - gradH,
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

    if (isPoster || data.testFrame != null) {
        context.fillStyle = '#1f1f1f';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // TODO isPoster
        console.log("right block");
        renderFrame(context, 6, duration, outputDimensions, eventsTexts, eventBottomPadding, gradients, noise, logo, data.label, data.dimPast, firstHalfTimes, secondHalfTimes);
        console.log("after render");

        const outputFile = `${outputPath}/${isPoster ? data.duration : "testFrame"}.png`;
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

        renderFrame(context, time, duration, outputDimensions, eventsTexts, eventBottomPadding, gradients, noise, logo, data.label, data.dimPast, firstHalfTimes, secondHalfTimes);

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

function renderFrame(context, time, duration, dimensions, eventsTexts, eventBottomPadding, gradients, noise, logo, label, dimPast, firstTimes, secondTimes = null) {
    console.log(time);
    console.log(duration);
    let gradientMiddleTimeOffset = -2;
    gradients.forEach(gradient => {
        const x = interpolateKeyframes([
            { time: 0, value: gradient.xStart },
            { time: (duration / 2) + gradientMiddleTimeOffset, value: gradient.xMid },
            { time: duration, value: gradient.xEnd }
        ], time, "inOutBack");
        const y = interpolateKeyframes([
            { time: 0, value: gradient.yStart },
            { time: (duration / 2) + gradientMiddleTimeOffset, value: gradient.yMid },
            { time: duration, value: gradient.yEnd }
        ], time, "inOutBack");
        context.drawImage(gradient.img, x, y, gradient.w, gradient.h);
        gradientMiddleTimeOffset++;
    });
    context.drawImage(noise, 0, 0, dimensions.w, dimensions.h);

    context.drawImage(logo, dimensions.w - 120, 0, 150, 150);

    context.fillStyle = "#d4d4d4";
    context.font = "80px 'Neue Machina Regular'";
    context.textAlign = "center";
    context.fillText(label, dimensions.w / 2, 125);
    context.fillText(label, (dimensions.w / 2) + 2, 125);

    /* renderAllTexts(context, time, dimensions.w, dimPast, eventsTexts[0], eventBottomPadding[0], firstTimes);
    if (secondTimes) {
        renderAllTexts(context, time, dimensions.w, dimPast, eventsTexts[1], eventBottomPadding[1], secondTimes);
    } */
}

function renderAllTexts(context, time, w, dimPast, texts, eventBottomPadding, times) {
    let currentTextFadeInStart = times.inStart;
    let currentTextFadeOutStart = times.outStart;

    let currY = yBorder + (eventBottomPadding / 2);

    const dateToLabelSpacer = 60;
    const lineStartX = w / 2;
    const xPosition = 50;

    context.lineWidth = 3;

    texts.forEach(eventText => {
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

        const lineLeftX = interpolateKeyframes([
            { time: lineFadeInStart, value: lineStartX },
            { time: lineFadeInEnd, value: xPosition },
            { time: lineFadeOutStart, value: xPosition },
            { time: lineFadeOutEnd, value: lineStartX }
        ], time, "easeInOutQuint");
        const lineRightX = interpolateKeyframes([
            { time: lineFadeInStart, value: lineStartX },
            { time: lineFadeInEnd, value: w - xPosition },
            { time: lineFadeOutStart, value: w - xPosition },
            { time: lineFadeOutEnd, value: lineStartX }
        ], time, "easeInOutQuint");
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
    else if (easing === "easeInOutQuint") t = easeInOutQuint(t);

    return keyframe1.value + (keyframe2.value - keyframe1.value) * t;
}

function easeInOutBack(x) {
    const c1 = 1.70158 * .75;
    const c2 = c1 * 1.525 * .75;

    return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

const easeInOutQuint = (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;

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