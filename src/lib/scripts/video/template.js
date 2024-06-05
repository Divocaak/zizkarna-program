import fs from 'fs';
import nodeHtmlToImage from 'node-html-to-image';
import { getPngBase64, getImagePositionInRange, interpolateKeyframes } from '$lib/scripts/video/helperFunctions.js';
import { ImageVideoElement } from '$lib/classes/video/imageVideoElement.js';

const outputPath = "dynamic/generator";
// NOTE framerate 30
// const frameRate = 30;
const frameRate = 1;

export async function renderTemplate({
    testPage = false,
    duration,
    outputDimensions = { w: 1080, h: 1920 },
    scalingFactor = { w: 1, h: 1 },
    paddingPx = { x: 0, y: 0 },
    onlyStaticMiddleFrame = false,
    calculations,
    styles,
    htmls
}) {
    // Clean up the temporary directories first
    for (const path of [outputPath]) {
        if (fs.existsSync(path)) await fs.promises.rm(path, { recursive: true });
        await fs.promises.mkdir(path, { recursive: true });
    }

    const logo = getPngBase64("./vidGenAssets/logo_transparent.png");
    const gradients = [];
    let gradientMiddleTimeOffset = -2;
    for (let i = 0; i < 4; i++) {
        const sizeFactor = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        const gradW = 512 * sizeFactor * scalingFactor.w;
        const gradH = 384 * sizeFactor * scalingFactor.h;
        const posStart = getImagePositionInRange(gradW, gradH, outputDimensions.w, outputDimensions.h);
        const posMid = getImagePositionInRange(gradW, gradH, outputDimensions.w, outputDimensions.h);
        const posEnd = getImagePositionInRange(gradW, gradH, outputDimensions.w, outputDimensions.h);

        gradients.push(new ImageVideoElement({
            content: getPngBase64(`./vidGenAssets/grads/grad${i}.png`),
            keyframesX: [
                { time: 0, value: posStart.x },
                { time: (duration / 2) + gradientMiddleTimeOffset, value: posMid.x },
                { time: duration, value: posEnd.x }
            ],
            keyframesY: [
                { time: 0, value: posStart.y },
                { time: (duration / 2) + gradientMiddleTimeOffset, value: posMid.y },
                { time: duration, value: posEnd.y }
            ],
            wPx: gradW,
            hPx: gradH
        }));

        /* gradients.push({
            img: getPngBase64(`./vidGenAssets/grads/grad${i}.png`),
            posStart: getImagePositionInRange(gradW, gradH, outputDimensions.w, outputDimensions.h),
            posMid: posMid,
            posEnd: getImagePositionInRange(gradW, gradH, outputDimensions.w, outputDimensions.h),
            w: gradW,
            h: gradH,
            currentX: posMid.x,
            currentY: posMid.y
        }); */
    }

    // TODO fonts
    // NOTE mby call getHtml only once and save to var, then reuse?

    if (testPage) {
        return getHtml({
            time: 1,
            outputDimensions: outputDimensions,
            gradients: gradients,
            padding: paddingPx,
            styles: styles,
            htmls: htmls
        });
    }

    if (onlyStaticMiddleFrame) {
        // NOTE test frame and/or static poster
        //renderFrame(context, 6, duration, outputDimensions, scalingFactor, eventsTexts, topBorder, eventBottomPadding, gradients, noise, logo, data.label, data.dimPast, firstHalfTimes, secondHalfTimes, isPoster);
        // return
        const responseFile = `${outputPath}/output.jpg`;
        renderFrameTemplate(responseFile, getHtml({
            time: 1,
            outputDimensions: outputDimensions,
            gradients: gradients,
            padding: paddingPx,
            styles: styles,
            htmls: htmls
        }));
        return responseFile;
    }

    const frameCount = Math.floor(duration * frameRate);
    //const frames = [];
    for (let i = 0; i < frameCount; i++) {
        const time = i / frameRate;

        // frame specific values calculations
        /* gradients.forEach(gradient => {
            gradient.currentX = interpolateKeyframes([
                { time: 0, value: gradient.xStart },
                { time: (duration / 2) + gradientMiddleTimeOffset, value: gradient.xMid },
                { time: duration, value: gradient.xEnd }
            ], time, "inOutBack");
            gradient.currentY = interpolateKeyframes([
                { time: 0, value: gradient.yStart },
                { time: (duration / 2) + gradientMiddleTimeOffset, value: gradient.yMid },
                { time: duration, value: gradient.yEnd }
            ], time, "inOutBack");
            gradientMiddleTimeOffset++;
        }); */

        calculations(time, duration);

        const paddedNumber = String(i).padStart(4, '0');
        /* URGENT named parameters */
        await renderFrameTemplate(`${outputPath}/frame-${paddedNumber}.jpg`, getHtml({
            time: time,
            outputDimensions: outputDimensions,
            gradients: gradients,
            padding: paddingPx,
            styles: styles,
            htmls: htmls
        }));
        //.then((result) => frames.push(result));

        // TODO idealne nepouzit a ukladat do bufferu, ale pro test ucely nechat lezet
        /* const outputFile = `${outputPath}/video.mp4`;
        await stitchFramesToVideo(
            `${outputPath}/frame-%04d.png`,
            outputFile,
            duration,
            frameRate,
        );
    
        return new Response(JSON.stringify({ path: "outputFile", format: "video" }, { status: 200 })); */
    }
}

async function renderFrameTemplate(outputFile, html) {
    // NOTE performance https://github.com/frinyvonnick/node-html-to-image/issues/80
    console.time("render");
    //const frame = await nodeHtmlToImage({
    return nodeHtmlToImage({
        output: outputFile,
        type: "jpeg",
        /* NOTE 100? default is 80 */
        quality: 80,
        puppeteerArgs: {
            /* concurrency: Cluster.CONCURRENCY_CONTEXT, */
            maxConcurrency: 10,
            puppeteerOptions: { args: [['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote']] }
        },
        html: html,
    }).then(() => console.timeEnd("render"));
}

const getHtml = ({
    time = 1,
    outputDimensions = { w: 1080, h: 1920 },
    gradients = [],
    padding = { x: 0, y: 0 },
    styles = "",
    htmls = ""
}) =>
    `<html>
    <head>
        <style>
            html{
                background: lime;
            }

            body {
                margin: 0;
                background-color: #1f1f1f;
                position: absolute;
                width: ${outputDimensions.w}px;
                height: ${outputDimensions.h}px;
                overflow-x: hidden;
            }

            .bg-holder, .noise{
                position: absolute;
                top: 0;
                left: 0;
                padding: 0;
                margin: 0;
                width: 100%;
                height: 100%;
            }

            .noise{
                background-image: url(data:image/png;base64,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);
            }

            .bg-holder .gradient{
                position: absolute;
                padding: 0;
                margin: 0;
            }
            
            .bg-holder .gradient:nth-of-type(1){
                height: ${gradients[0].hPx}px;
                width: ${gradients[0].wPx}px;
                left: ${gradients[0].getXInTime(time, "inOutBack")}px;
                bottom: ${gradients[0].getYInTime(time, "inOutBack")}px;
            }
            
            .bg-holder .gradient:nth-of-type(2){
                height: ${gradients[1].hPx}px;
                width: ${gradients[1].wPx}px;
                left: ${gradients[1].getXInTime(time, "inOutBack")}px;
                bottom: ${gradients[1].getYInTime(time, "inOutBack")}px;
            }
            
            .bg-holder .gradient:nth-of-type(3){
                height: ${gradients[2].hPx}px;
                width: ${gradients[2].wPx}px;
                left: ${gradients[2].getXInTime(time, "inOutBack")}px;
                bottom: ${gradients[2].getYInTime(time, "inOutBack")}px;
            }
            
            .bg-holder .gradient:nth-of-type(4){
                height: ${gradients[3].hPx}px;
                width: ${gradients[3].wPx}px;
                left: ${gradients[3].getXInTime(time, "inOutBack")}px;
                bottom: ${gradients[3].getYInTime(time, "inOutBack")}px;
            }

            .content{
                position: relative;
                border: 1px solid red;
                top: 0;
                left: 0;
                margin: 0;
                max-width: ${outputDimensions.w}px;
                max-height: ${outputDimensions.h}px;
                padding: ${padding.y}px ${padding.x}px;
            }
            
            ${styles}
        </style>
    </head>
    <body>
        <div class="bg-holder">
            <img src="${gradients[0].content}" class="gradient"/>
            <img src="${gradients[1].content}" class="gradient"/>
            <img src="${gradients[2].content}" class="gradient"/>
            <img src="${gradients[3].content}" class="gradient"/>
            <div class="noise"></div>
        </div>
        <div class="content">
            ${htmls}
        </div>
    </body>
</html>`;