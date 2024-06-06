// NOTE need?
import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';
import path from 'path';

import { renderTemplate } from '$lib/scripts/video/template.js';
import { TextVideoElement } from '$lib/classes/video/textVideoElement.js';
import { ImageVideoElement } from '$lib/classes/video/imageVideoElement.js';

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

    // NOTE need?
    ffmpeg.setFfmpegPath(ffmpegStatic);

    const data = await request.json();

    const testPage = true;
    const testFrame = false;
    const response = await renderTemplate({
        testPage: testPage,
        duration: duration,
        paddingPx: { x: 100, y: 250 },
        calculations: (time, duration) => console.log(`curr ${time}/${duration}`),
        styles: ".test{color:red;}",
        htmls: "<p class='test'>test tesaasfasfaf</p>"
    });

    return new Response(JSON.stringify({
        output: response,
        format: (testPage ? "html" : (testFrame ? "image" : "video"))
    }, { status: 200 }));
}

function renderFrame(context, time, poster, posterDimensions, eventLabel, eventTags, bandLabel, bandDesc, bandImage, bandImageDimensions, bandTags, bandStageTime, logo = null, date = null, doors = null, tickets = null) {

    /* event section */

    const eventLabel = new TextVideoElement({
        content: data.eventLabel,
        posX: [
            { time: eventOut, value: 50 },
            { time: eventEnd, value: -1500 }
        ],
        posY: [
            { time: eventIn, value: -200 },
            { time: eventContent, value: 200 }
        ],
        fontName: "Neue Machina Regular",
        fontSizePx: 70
    });

    const poster = new ImageVideoElement({
        content: `dynamic/events/${data.eventId}.jpg`,
        posX: [
            { time: eventIn, value: -1400 },
            { time: eventContent, value: 0 },
            { time: eventOut, value: 0 },
            { time: eventEnd, value: -1400 }
        ],
        posY: 500,
        /* TODO dimensions */
        wPx: 300,
        hPx: 300
    });

    const eventTags = new TextVideoElement({
        content: data.eventTags,
        posX: [
            { time: eventOut, value: w / 2 },
            { time: eventEnd, value: 1080 * -1.5 }
        ],
        posY: [
            { time: eventIn, value: 2000 },
            { time: eventContent, value: 1500 }
        ],
        fontName: "Neue Machina Regular",
        fontSizePx: 40,
        textAlign: "center"
    });

    /* band section */

    const bandLabel = new TextVideoElement({
        content: data.bandLabel,
        posX: [
            { time: bandIn, value: 1080 },
            { time: bandContent, value: 50 },
            { time: bandOut, value: 50 },
            { time: bandEnd, value: -1400 },
        ],
        posY: 150,
        fontName: "Neue Machina Regular",
        fontSizePx: 70
    });

    const bandDesc = new TextVideoElement({
        content: data.bandDesc,
        posX: [
            { time: bandIn + .1, value: 1080 },
            { time: bandContent, value: 60 },
            { time: bandOut, value: 60 },
            { time: bandEnd, value: -1400 },
        ],
        posY: 300,
        fontName: "Karla Regular",
        fontSizePx: 40
    });

    const bandStageTime = new TextVideoElement({
        content: data.bandStageTime,
        posX: [
            { time: bandIn + .2, value: 1080 * 1.5 },
            { time: bandContent, value: w / 2 },
            { time: bandOut, value: w / 2 },
            { time: bandEnd, value: 1080 * -1.5 },
        ],
        posY: 950,
        fontName: "Karla Regular",
        fontSizePx: 40,
        textAlign: "center"
    });

    const bandTags = new TextVideoElement({
        content: data.bandTags,
        posX: [
            { time: bandIn + .3, value: 1080 * 1.5 },
            { time: bandContent, value: w / 2 },
            { time: bandOut, value: w / 2 },
            { time: bandEnd, value: 1080 * -1.5 },
        ],
        posY: 1050,
        fontName: "Neue Machina Regular",
        fontSizePx: 40,
        textAlign: "center"
    });

    const bandImage = new ImageVideoElement({
        content: `dynamic/bands/${data.bandImage}`,
        posX: [
            { time: bandOut, value: 0 },
            { time: bandEnd, value: -1400 }
        ],
        posY: [
            { time: bandIn, value: 2000 },
            { time: bandContent, value: 1920 - (bandImageDimensions.h) }
        ],
        // TODO dimensions
        wPx: 100,
        hPx: 100
    });

    /* zz section */

    const logo = new ImageVideoElement({
        content: "./vidGenAssets/logo_transparent.png",
        posX: 0,
        posY: [
            { time: zzIn + .2, value: -1080 },
            { time: zzContent, value: 150 }
        ],
        /* TODO dimensions */
        wPx: 100,
        hPx: 100
    });

    const date = new TextVideoElement({
        content: data.date,
        posX: [
            { time: zzIn, value: 1080 * 1.5 },
            { time: zzContent, value: w / 2 }
        ],
        posY: 1300,
        fontName: "Neue Machina Regular",
        fontSizePx: 60
    });

    const doors = new TextVideoElement({
        content: data.date,
        posX: [
            { time: zzIn + .1, value: 1080 * 1.5 },
            { time: zzContent, value: w / 2 }
        ],
        posY: 1450,
        fontName: "Neue Machina Regular",
        fontSizePx: 60
    });

    /* TODO if not null */
    const tickets = new TextVideoElement({
        content: data.tickets,
        posX: [
            { time: zzIn + .2, value: 1080 * 1.5 },
            { time: zzContent, value: w / 2 }
        ],
        posY: 1600,
        fontName: "Neue Machina Regular",
        fontSizePx: 60
    });
}

// NOTE need?
function getImgDimensions(img, type, maxWidth, maxHeight) {
    const imgRatio = img.height / img.width;
    const winRatio = maxHeight / maxWidth;
    /* landscape img */
    if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) return { w: maxWidth, h: maxWidth * imgRatio };
    /* portrait img */
    if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) return { w: maxWidth * winRatio / imgRatio, h: maxHeight };
}