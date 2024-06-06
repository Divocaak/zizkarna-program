// NOTE need?
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

// NOTE need?
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