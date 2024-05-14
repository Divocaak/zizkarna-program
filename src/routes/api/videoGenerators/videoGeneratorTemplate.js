import fs from 'fs';
import nodeHtmlToImage from 'node-html-to-image';
import { getPngBase64, interpolateKeyframes } from './vidGenHelperFunctions';

const outputPath = "dynamic/generator";
// TODO
// const frameRate = 30;
const frameRate = 1;

export async function renderTemplate(duration, outputDimensions, scalingFactor, middleFrameCondition = false) {
    // Clean up the temporary directories first
    // TODO delete after buffer implementation
    for (const path of [outputPath]) {
        if (fs.existsSync(path)) await fs.promises.rm(path, { recursive: true });
        await fs.promises.mkdir(path, { recursive: true });
    }

    const noise = getPngBase64("./vidGenAssets/grads/noise.png");
    const logo = getPngBase64("./vidGenAssets/logo_transparent.png");
    const gradients = [];
    let gradientMiddleTimeOffset = -2;
    for (let i = 0; i < 4; i++) {
        const sizeFactor = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        const gradW = 512 * sizeFactor * scalingFactor.w;
        const gradH = 384 * sizeFactor * scalingFactor.h;
        gradients.push({
            img: getPngBase64(`./vidGenAssets/grads/grad${i}.png`),
            xStart: Math.floor(Math.random() * (outputDimensions.w + gradW + 1)) - gradW,
            xMid: Math.floor(Math.random() * (outputDimensions.w + gradW + 1)) - gradW,
            xEnd: Math.floor(Math.random() * (outputDimensions.w + gradW + 1)) - gradW,
            yStart: Math.floor(Math.random() * (outputDimensions.h + gradH + 1)) - gradH,
            yMid: Math.floor(Math.random() * (outputDimensions.h + gradH + 1)) - gradH,
            yEnd: Math.floor(Math.random() * (outputDimensions.h + gradH + 1)) - gradH,
            w: gradW,
            h: gradH,
            currentX: this.xStart,
            currentY: this.yStart
        });
    }

    // TODO fonts

    if (middleFrameCondition) {
        // NOTE test frame and/or static poster
        //renderFrame(context, 6, duration, outputDimensions, scalingFactor, eventsTexts, topBorder, eventBottomPadding, gradients, noise, logo, data.label, data.dimPast, firstHalfTimes, secondHalfTimes, isPoster);
        // return
    }

    const frameCount = Math.floor(duration * frameRate);
    //const frames = [];
    for (let i = 0; i < frameCount; i++) {
        const time = i / frameRate;

        // frame specific values calculations
        gradients.forEach(gradient => {
            /* const x = middleFrameCondition ? gradient.xMid : interpolateKeyframes([
                { time: 0, value: gradient.xStart },
                { time: (duration / 2) + gradientMiddleTimeOffset, value: gradient.xMid },
                { time: duration, value: gradient.xEnd }
            ], time, "inOutBack");
            const y = middleFrameCondition ? gradient.yMid : interpolateKeyframes([
                { time: 0, value: gradient.yStart },
                { time: (duration / 2) + gradientMiddleTimeOffset, value: gradient.yMid },
                { time: duration, value: gradient.yEnd }
            ], time, "inOutBack"); */
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
        });

        const paddedNumber = String(i).padStart(4, '0');
        await renderFrameTemplate(`${outputPath}/frame-${paddedNumber}.jpg`, outputDimensions, gradients, noise);
        //.then((result) => frames.push(result));

        // TODO idealne nepouzit a ukladat do bufferu, ale pro test ucely nechat lezet
        /* const outputFile = `${outputPath}/video.mp4`;
        await stitchFramesToVideo(
            `${outputPath}/frame-%04d.png`,
            outputFile,
            duration,
            frameRate,
        );
    
        return new Response(JSON.stringify({ path: "outputFile", img: false }, { status: 200 })); */
    }
}

async function renderFrameTemplate(outputFile, outputDimensions, gradients, noise) {
    // TODO performance https://github.com/frinyvonnick/node-html-to-image/issues/80
    console.time("render");
    //const frame = await nodeHtmlToImage({
    return nodeHtmlToImage({
        output: outputFile,
        type: "jpeg",
        /* TODO 100? default is 80 */
        quality: 80,
        puppeteerArgs: {
            /* concurrency: Cluster.CONCURRENCY_CONTEXT, */
            maxConcurrency: 10,
            puppeteerOptions: { args: [['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote']] }
        },
        html: `
                <html>
                    <head>
                        <style>
                            body {
                                background-color: #1f1f1f;
                                width: ${outputDimensions.w}px;
                                height: ${outputDimensions.h}px
                            }

                            .fill-container{
                                position:absolute;
                                top:0;
                                left:0;
                                width:100%;
                                height:100%;
                            }

                            .bg-holder .gradient:nth-of-type(1){
                                position: absolute;
                                height: ${gradients[0].h};
                                width: ${gradients[0].w};
                                left: ${gradients[0].currentX};
                                top: ${gradients[0].currentY};
                            }

                            .bg-holder .gradient:nth-of-type(2){
                                position: absolute;
                                height: ${gradients[1].h};
                                width: ${gradients[1].w};
                                left: ${gradients[1].currentX};
                                top: ${gradients[1].currentY};
                            }

                            .bg-holder .gradient:nth-of-type(3){
                                position: absolute;
                                height: ${gradients[2].h};
                                width: ${gradients[2].w};
                                left: ${gradients[2].currentX};
                                top: ${gradients[2].currentY};
                            }

                            .bg-holder .gradient:nth-of-type(4){
                                position: absolute;
                                height: ${gradients[3].h};
                                width: ${gradients[3].w};
                                left: ${gradients[3].currentX};
                                top: ${gradients[3].currentY};
                            }
                        </style>
                    </head>
                    <body>
                        <div class="bg-holder">
                            <img src="${gradients[0].img}" class="gradient"/>
                            <img src="${gradients[1].img}" class="gradient"/>
                            <img src="${gradients[2].img}" class="gradient"/>
                            <img src="${gradients[3].img}" class="gradient"/>
                            <img src="${noise}" class="fill-container"/>
                        </div>
                        Hello world!
                    </body>
                </html>`,
    }).then(() => console.timeEnd("render"));
}