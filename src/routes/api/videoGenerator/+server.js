import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';

const neuePath = './vidGenAssets/NeueMachina-Regular.otf';
const karlaPath = "./vidGenAssets/Karla-VariableFont_wght.ttf";
const logoPath = "./vidGenAssets/logo_transparent.png";

const outputPath = "dynamic/generator";

const frameRate = 1;

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

    registerFont(neuePath, { family: 'Neue Machina' })
    registerFont(karlaPath, { family: 'Karla' })

    const data = await request.json();
    const event = data.event;
    const band = data.band;
    const eventTags = data.eventTags;

    const canvas = new Canvas(1080, 1920);
    const context = canvas.getContext('2d');

    const frameCount = Math.floor(duration * frameRate);

    ffmpeg.setFfmpegPath(ffmpegStatic);

    // Clean up the temporary directories first
    for (const path of [outputPath]) {
        if (fs.existsSync(path)) await fs.promises.rm(path, { recursive: true });
        await fs.promises.mkdir(path, { recursive: true });
    }

    const eventLabelWrapped = getWrappedText(event.label, 120, context, 70);
    const eventTagsWrapped = getWrappedText(getTagsString(eventTags), 300, context, 40);
    const poster = await loadImage(`dynamic/events/${event.id}.jpg`);
    const posterDimensions = getImgDimensions(poster, "contain", 1080, 1500);

    const bandLabelWrapped = getWrappedText(band.label, 160, context, 60);
    const bandDescWrapped = getWrappedText(band.description, 220, context, 50);
    const bandTagsWrapped = getWrappedText(getTagsString(band.tags), 300, context, 40);
    const bandImage = await loadImage(`dynamic/bands/${band.id}/${band.imgs[0]}`);
    const bandImageDimensions = getImgDimensions(bandImage, "contain", 1080, 1500);
    const bandStageTimeWrapped = getWrappedText(`Stage time: ${band.stageTime.substring(0, band.stageTime.length - 3)}`, 300, context, 40);

    let dateFormatted = new Date(event.date).toLocaleDateString('cs-CZ', {
        month: 'numeric',
        day: 'numeric',
        weekday: 'long'
    });
    const dateWrapped = getWrappedText(dateFormatted, 500, context, 90);
    const doorsWrapped = getWrappedText(`otevřeno od ${event.doors.substring(0, event.doors.length - 3)}`, 500, context, 90);
    const logo = await loadImage(logoPath);

    // Render each frame
    for (let i = 0; i < frameCount; i++) {
        const time = i / frameRate;

        // clear canvas
        context.fillStyle = '#1f1f1f';
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderFrame(context, time, poster, posterDimensions, eventLabelWrapped, eventTagsWrapped, bandLabelWrapped, bandDescWrapped, bandImage, bandImageDimensions, bandTagsWrapped, bandStageTimeWrapped, logo, dateWrapped, doorsWrapped);

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

function renderFrame(context, time, poster, posterDimensions, eventLabel, eventTags, bandLabel, bandDesc, bandImage, bandImageDimensions, bandTags, bandStageTime, logo, date, doors) {

    context.fillStyle = "#d4d4d4";

    /* event section */

    const eventLabelX = interpolateKeyframes([
        { time: eventOut, value: 100 },
        { time: eventEnd, value: -1400 }
    ], time);
    const eventLabelY = interpolateKeyframes([
        { time: eventIn, value: -200 },
        { time: eventContent, value: 250 }
    ], time);
    context.font = "70px Neue Machina";
    eventLabel.forEach(function (item) {
        context.fillText(item[0], eventLabelX, eventLabelY + item[1]);
    });

    const posterX = interpolateKeyframes([
        { time: eventIn, value: -1400 },
        { time: eventContent, value: 0 },
        { time: eventOut, value: 0 },
        { time: eventEnd, value: -1400 }
    ], time);
    context.drawImage(poster, posterX, 500, posterDimensions.w, posterDimensions.h);

    const eventTagsX = interpolateKeyframes([
        { time: eventOut, value: 140 },
        { time: eventEnd, value: -1400 }
    ], time);
    const eventTagsY = interpolateKeyframes([
        { time: eventIn, value: 2000 },
        { time: eventContent, value: 1500 }
    ], time);
    context.font = "40px Neue Machina";
    eventTags.forEach(function (item) {
        context.fillText(item[0], eventTagsX, eventTagsY + item[1]);
    });

    /* band section */

    const bandLabelX = interpolateKeyframes([
        { time: bandIn, value: 1080 },
        { time: bandContent, value: 140 },
        { time: bandOut, value: 140 },
        { time: bandEnd, value: -1400 },
    ], time);
    context.font = "70px Neue Machina";
    bandLabel.forEach(function (item) {
        context.fillText(item[0], bandLabelX, 150 + item[1]);
    });

    const bandDescX = interpolateKeyframes([
        { time: bandIn + .1, value: 1080 },
        { time: bandContent, value: 100 },
        { time: bandOut, value: 100 },
        { time: bandEnd, value: -1400 },
    ], time);
    context.font = "40px Karla";
    bandDesc.forEach(function (item) {
        context.fillText(item[0], bandDescX, 300 + item[1]);
    });

    const bandStageTimeX = interpolateKeyframes([
        { time: bandIn + .2, value: 1080 },
        { time: bandContent, value: 140 },
        { time: bandOut, value: 140 },
        { time: bandEnd, value: -1400 },
    ], time);
    bandStageTime.forEach(function (item) {
        context.fillText(item[0], bandStageTimeX, 950 + item[1]);
    });

    const bandTagsX = interpolateKeyframes([
        { time: bandIn + .3, value: 1080 },
        { time: bandContent, value: 140 },
        { time: bandOut, value: 140 },
        { time: bandEnd, value: -1400 },
    ], time);
    context.font = "40px Neue Machina";
    bandTags.forEach(function (item) {
        context.fillText(item[0], bandTagsX, 1050 + item[1]);
    });

    const bandImageX = interpolateKeyframes([
        { time: bandOut, value: 0 },
        { time: bandEnd, value: -1400 }
    ], time);
    const bandImageY = interpolateKeyframes([
        { time: bandIn, value: 2000 },
        { time: bandContent, value: 1920 - (bandImageDimensions.h) }
    ], time);
    context.drawImage(bandImage, bandImageX, bandImageY, bandImageDimensions.w, bandImageDimensions.h);

    /* zz section */

    const logoY = interpolateKeyframes([
        { time: zzIn + .2, value: -1080 },
        { time: zzContent, value: 150 }
    ], time);
    context.drawImage(logo, 0, logoY, 1080, 1080);

    const dateX = interpolateKeyframes([
        { time: zzIn, value: 1080 },
        { time: zzContent, value: 250 }
    ], time);
    context.font = "60px Neue Machina";
    date.forEach(function (item) {
        context.fillText(item[0], dateX, 1300 + item[1]);
    });

    const doorsX = interpolateKeyframes([
        { time: zzIn + .1, value: 1080 },
        { time: zzContent, value: 250 }
    ], time);
    doors.forEach(function (item) {
        context.fillText(item[0], doorsX, 1500 + item[1]);
    });
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