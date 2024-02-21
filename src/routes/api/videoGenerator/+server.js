import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';

export async function POST({ request }) {

    const data = await request.json();
    /* NOTE */

    const event = data.event;
    const band = data.band;

    const outputPath = "dynamic/generator";

    ffmpeg.setFfmpegPath(ffmpegStatic);

    // Clean up the temporary directories first
    for (const path of [outputPath]) {
        if (fs.existsSync(path)) {
            await fs.promises.rm(path, { recursive: true });
        }
        await fs.promises.mkdir(path, { recursive: true });
    }

    const canvas = new Canvas(1080, 1920);
    const context = canvas.getContext('2d');

    // Load the image from file
    const poster = await loadImage(`dynamic/events/${event.id}.jpg`);

    const duration = 3;
    const frameRate = 1;
    const frameCount = Math.floor(duration * frameRate);

    // Render each frame
    for (let i = 0; i < frameCount; i++) {

        const time = i / frameRate;

        console.log(`Rendering frame ${i} at ${Math.round(time * 10) / 10} seconds...`);

        // Clear the canvas with a white background color. This is required as we are
        // reusing the canvas with every frame
        context.fillStyle = '#1f1f1f';
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderFrame(context, duration, time, poster);

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

    /* NOTE response */
    return new Response(JSON.stringify({ message: outputPath }, { status: 200 }));
}

function renderFrame(context, duration, time, poster) {

    // Calculate the x position over time
    const x = interpolateKeyframes([
        // At time 0, we want x to be 100
        { time: 0, value: 100 },
        // At time 1.5, we want x to be 550 (using Cubic easing)
        { time: 1.5, value: 550, easing: 'cubic-in-out' },
        // At time 3, we want x to be 200 (using Cubic easing)
        { time: 3, value: 200, easing: 'cubic-in-out' },
    ], time);

    context.font = "50px serif";
    context.fillStyle = "red";
    context.fillText("Hello World", 500, 500);

    // Draw the image
    context.drawImage(poster, x, 100, 500, 500);
}

function interpolateKeyframes(keyframes, time) {

    if (keyframes.length < 2) {
        throw new Error('At least two keyframes should be provided');
    }

    const firstKeyframe = keyframes[0];
    if (time < firstKeyframe.time) {
        return firstKeyframe.value;
    }

    const lastKeyframe = keyframes[keyframes.length - 1];
    if (time >= lastKeyframe.time) {
        return lastKeyframe.value;
    }

    let index;
    for (index = 0; index < keyframes.length - 1; index++) {
        if (keyframes[index].time <= time && keyframes[index + 1].time >= time) {
            break;
        }
    }

    const keyframe1 = keyframes[index];
    const keyframe2 = keyframes[index + 1];

    let t = (time - keyframe1.time) / (keyframe2.time - keyframe1.time);

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