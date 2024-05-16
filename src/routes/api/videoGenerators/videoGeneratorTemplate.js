import fs from 'fs';
import nodeHtmlToImage from 'node-html-to-image';
import { getPngBase64, interpolateKeyframes } from './vidGenHelperFunctions';

const outputPath = "dynamic/generator";
// TODO
// const frameRate = 30;
const frameRate = 1;

export async function renderTemplate(testPage = false, duration, outputDimensions, scalingFactor, onlyStaticMiddleFrame = false, calculations, styles, htmls) {
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
            currentX: this.xMid,
            currentY: this.yMid
        });
    }

    // TODO fonts
    // TODO mby call getHtml only once and save to var, then reuse?

    if (testPage) {
        return getHtml(outputDimensions, gradients, styles, htmls);
    }

    if (onlyStaticMiddleFrame) {
        // NOTE test frame and/or static poster
        //renderFrame(context, 6, duration, outputDimensions, scalingFactor, eventsTexts, topBorder, eventBottomPadding, gradients, noise, logo, data.label, data.dimPast, firstHalfTimes, secondHalfTimes, isPoster);
        // return
        const responseFile = `${outputPath}/output.jpg`;
        renderFrameTemplate(responseFile, getHtml(outputDimensions, gradients, styles, htmls));
        return responseFile;
    }

    const frameCount = Math.floor(duration * frameRate);
    //const frames = [];
    for (let i = 0; i < frameCount; i++) {
        const time = i / frameRate;

        // frame specific values calculations
        gradients.forEach(gradient => {
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

        calculations(time, duration);

        const paddedNumber = String(i).padStart(4, '0');
        await renderFrameTemplate(`${outputPath}/frame-${paddedNumber}.jpg`, getHtml(outputDimensions, gradients, styles, htmls));
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
        html: html,
    }).then(() => console.timeEnd("render"));
}

/* background-color: #1f1f1f; */
const getHtml = (outputDimensions, gradients, styles, htmls) =>
`<html>
    <head>
        <style>
            body {
                background-color:whitesmoke;
                width: ${outputDimensions.w}px;
                height: ${outputDimensions.h}px
            }

            .fill-container, .noise{
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
                padding:0;
                margin:0;
            }

            .noise{
                background-image: url(data:image/png;base64,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);
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
            
            ${styles}
        </style>
    </head>
    <body>
        <div class="bg-holder">
            <img src="${gradients[0].img}" class="gradient"/>
            <img src="${gradients[1].img}" class="gradient"/>
            <img src="${gradients[2].img}" class="gradient"/>
            <img src="${gradients[3].img}" class="gradient"/>
            <div class="noise"><div/>
        </div>
        ${htmls}
    </body>
</html>`;