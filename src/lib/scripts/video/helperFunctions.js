import fs from 'fs';

export function getImagePositionInRange(imgW, imgH, maxW, maxH) {
    const minX = -imgW / 2;
    const maxX = maxW - imgW / 2;
    const x = Math.random() * (maxX - minX) + minX;

    const minY = -imgH / 2;
    const maxY = maxH - imgH / 2;
    const y = Math.random() * (maxY - minY) + minY;

    return { x, y };
}

export function getWrappedText(text, maxWidth, context, lineHeight) {
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

/* TODO move to videoElement object */
export function interpolateKeyframes({ keyframes = [], time = 0, easing = null }) {

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

export function easeInOutBack(x) {
    const c1 = 1.70158 * .75;
    const c2 = c1 * 1.525 * .75;

    return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

export const easeInOutQuint = (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;

export function getPngBase64(pathToImg) {
    const image = fs.readFileSync(pathToImg);
    const base64Image = new Buffer.from(image).toString('base64');
    return `data:image/png;base64,${base64Image}`;
}

export async function stitchFramesToVideo(framesFilepath, outputFilepath, duration, frameRate) {
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