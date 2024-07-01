import fs from 'fs';
/* TODO unins */
import nodeHtmlToImage from 'node-html-to-image';
import font2base64 from 'node-font2base64';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { ImageVideoElement } from '$lib/classes/video/imageVideoElement.js';
import { PassThrough } from 'stream';
import { PaddingElement } from '$lib/classes/video/paddingHolder';
import { Cluster } from 'puppeteer-cluster';
import puppeteer from 'puppeteer';

const outputPath = "dynamic/generator/";
const frameRate = 30;

const puppeteerLaunchOptions = {
    headless: "new",
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4, // or higher if your system can handle it
    args: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
    ]
};

export async function renderTemplate({
    onlyFrame = null,
    duration,
    outputDimensions = { w: 1080, h: 1920 },
    padding = PaddingElement({ x: 0, y: 0 }),
    overviewPoster = false,
    videoElements = [],
    additionalInnerContainerStyles = ""
}) {
    ffmpeg.setFfmpegPath(ffmpegStatic);

    // Clean up the temporary directories first
    for (const path of [outputPath]) {
        if (fs.existsSync(path)) await fs.promises.rm(path, { recursive: true });
        await fs.promises.mkdir(path, { recursive: true });
    }

    // duration value is a4 or b0 (posters from overviewGenerators)
    if (typeof duration === 'string') duration = 2;

    const gradients = [];
    let gradientMiddleTimeOffset = -2;
    for (let i = 0; i < 4; i++) {
        const sizeFactor = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        const gradW = outputDimensions.w * sizeFactor;
        const gradH = outputDimensions.h * sizeFactor;
        const posStart = ImageVideoElement.getImagePositionInRange(gradW, gradH, outputDimensions.w, outputDimensions.h);
        const posMid = ImageVideoElement.getImagePositionInRange(gradW, gradH, outputDimensions.w, outputDimensions.h);
        const posEnd = ImageVideoElement.getImagePositionInRange(gradW, gradH, outputDimensions.w, outputDimensions.h);

        gradients.push(new ImageVideoElement({
            id: `gradient-${i}`,
            content: `./vidGenAssets/grads/grad${i}.png`,
            posX: [
                { time: 0, value: posStart.x },
                { time: (duration / 2) + gradientMiddleTimeOffset, value: posMid.x },
                { time: duration, value: posEnd.x }
            ],
            posY: [
                { time: 0, value: posStart.y },
                { time: (duration / 2) + gradientMiddleTimeOffset, value: posMid.y },
                { time: duration, value: posEnd.y }
            ],
            wPx: gradW,
            hPx: gradH,
            easing: "inOutBack"
        }));
        gradientMiddleTimeOffset++;
    }

    const fontDataNeue = font2base64.encodeToDataUrlSync('./vidGenAssets/neue.otf')
    const fontDataKarla = font2base64.encodeToDataUrlSync('./vidGenAssets/karla.ttf')

    const browser = await initPuppeteer();
    const page = await browser.newPage();
    await page.setViewport({ width: outputDimensions.w, height: outputDimensions.h });

    if (overviewPoster) {
        const html = getHtml({
            time: 1,
            outputDimensions: outputDimensions,
            gradients: gradients,
            padding: padding,
            videoElements: videoElements,
            additionalInnerContainerStyles: additionalInnerContainerStyles,
            fonts: {neue: fontDataNeue, karla: fontDataKarla}
        });

        if (onlyFrame) return html;

        renderFrame({ html: html });
        return `${outputPath}/output.jpg`;
    }

    // not null, which means that a number of wanted test frame is passed
    if (onlyFrame !== null) {
        return getHtml({
            time: onlyFrame,
            outputDimensions: outputDimensions,
            gradients: gradients,
            padding: padding,
            videoElements: videoElements,
            additionalInnerContainerStyles: additionalInnerContainerStyles,
            fonts: {neue: fontDataNeue, karla: fontDataKarla}
        });
    }

    const imageBuffers = await generateImages({
        page: page,
        duration: duration,
        outputDimensions: outputDimensions,
        gradients: gradients,
        padding: padding,
        videoElements: videoElements,
        additionalInnerContainerStyles: additionalInnerContainerStyles,
        fonts: {neue: fontDataNeue, karla: fontDataKarla}
    });

    await page.close();
    await browser.close();

    await createVideoFromBuffers(imageBuffers);
    /* BUG path?? */
    return new Response(JSON.stringify({ path: "outputFile", format: "video" }, { status: 200 }));
}

async function initPuppeteer() {
    return await puppeteer.launch(puppeteerLaunchOptions);
}

async function renderFrame({ page, html, isBufferFrame = false }) {
    page.setContent(html);
    return await page.screenshot({
        type: 'jpeg',
        quality: 80,
        encoding: isBufferFrame ? 'buffer' : 'binary',
        path: isBufferFrame ? undefined : `${outputPath}output.jpg`
    });
}

async function generateImages({ page, duration, outputDimensions, gradients, padding, videoElements, additionalInnerContainerStyles, fonts }) {
    const imageBuffers = [];
    const frameCount = Math.floor(duration * frameRate);
    console.time("render_all_frames");
    
    for (let i = 0; i < frameCount; i++) {
        console.time(`+- render_frame_${i}`);
        
        const time = i / frameRate;
        const buffer = await renderFrame({
            page: page,
            html: getHtml({
                time: time,
                outputDimensions: outputDimensions,
                gradients: gradients,
                padding: padding,
                videoElements: videoElements,
                additionalInnerContainerStyles: additionalInnerContainerStyles,
                fonts: fonts
            }),
            isBufferFrame: true
        });
        imageBuffers.push(buffer);
        
        console.timeEnd(`+- render_frame_${i}`);
    }
    
    console.timeEnd("render_all_frames");
    return imageBuffers;
};

const createVideoFromBuffers = (buffers) => {
    return new Promise((resolve, reject) => {
        const videoOutputPath = `${outputPath}output.mp4`;
        const inputStream = new PassThrough();

        ffmpeg(inputStream)
            .inputFormat('image2pipe')
            .inputFPS(frameRate)
            .videoCodec('libx264')
            .outputOptions(['-pix_fmt yuv420p'])
            .on('end', () => {
                console.log('Video created successfully');
                resolve(videoOutputPath);
            })
            .on('error', (err, stdout, stderr) => {
                console.error('Error creating video:', err);
                console.log("stdout:\n" + stdout);
                console.log("stderr:\n" + stderr);
                reject(err);
            })
            .save(videoOutputPath);

        // Write each buffer to the input stream
        buffers.forEach(buffer => {
            inputStream.write(buffer);
        });

        // End the input stream once all buffers are written
        inputStream.end();
    });
};

function getHtml({
    time,
    outputDimensions = { w: 1080, h: 1920 },
    gradients = [],
    padding = PaddingElement({ x: 0, y: 0 }),
    videoElements = [],
    additionalInnerContainerStyles = "",
    fonts
}) {
    let gradientsStyles = '';
    let gradientsHtml = '';
    gradients.forEach(gradient => {
        gradientsStyles += `${gradient.getGradientStyles(time)}\n`;
        gradientsHtml += `${gradient.getHtml()}\n`;
    });

    let elementStyles = '';
    let elementHtml = '';
    let elementHtmlImgs = "";
    videoElements.forEach(element => {
        if (element === null) return;
        elementStyles += `${element.getStyles(time)}\n`;

        if (element instanceof ImageVideoElement) {
            elementHtmlImgs += `${element.getHtml()}\n`;
            return;
        }
        elementHtml += `${element.getHtml()}\n`;
    });

    return `<html>
                <head>
                    <style>
                        @font-face {
                            font-family: 'Neue Machina Regular';
                            src: url(${fonts.neue}) format('woff2');
                        }

                        @font-face {
                            font-family: 'Karla Regular';
                            src: url(${fonts.karla}) format('woff2');
                        }

                        body {
                            margin: 0;
                            background-color: #1f1f1f;
                            position: absolute;
                            width: ${outputDimensions.w}px;
                            height: ${outputDimensions.h}px;
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
                    
                        .content{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: calc(100% - (${padding.getX()}px));
                            height: calc(100% - (${padding.getY()}px));
                            margin: 0;
                            padding: ${padding.getTop()}px ${padding.getRight()}px ${padding.getBottom()}px ${padding.getLeft()}px;
                            
                            background:rgba(255,0,0,.1);
                            border: 1px solid red;
                        }

                        .inner{
                            position:relative;
                            width:100%;
                            height:100%;
                            background: rgba(255,255,255,.1);
                            
                            ${additionalInnerContainerStyles}
                        }

                        ${gradientsStyles}

                        ${elementStyles}
                    </style>
                </head>
                <body>
                    <div class="bg-holder">
                        ${gradientsHtml}
                        <div class="noise"></div>
                    </div>
                    <div class="content">
                        <div class="inner">
                            ${elementHtml}
                        </div>
                        ${elementHtmlImgs}
                    </div>
                </body>
            </html>`;
}