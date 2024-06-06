// NOTE need?
import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';
import path from 'path';

import { renderTemplate } from '$lib/scripts/video/template.js';
import { TextVideoElement } from '$lib/classes/video/textVideoElement.js';
import { ImageVideoElement } from '$lib/classes/video/imageVideoElement.js';

const outputDimensions = { w: 1080, h: 1920 };

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
        outputDimensions: outputDimensions,
        paddingPx: { x: 100, y: 250 },
        videoElements: videoElements(data),
    });

    return new Response(JSON.stringify({
        output: response,
        format: (testPage ? "html" : (testFrame ? "image" : "video"))
    }, { status: 200 }));
}

const videoElements = (data) => [
    new TextVideoElement({
        id: "event-label",
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
        fontSizePx: 70,
        easing: "inOutBack"
    }),
    new ImageVideoElement({
        id: "event-poster",
        content: `dynamic/events/${data.eventId}.jpg`,
        posX: [
            { time: eventIn, value: -1400 },
            { time: eventContent, value: 0 },
            { time: eventOut, value: 0 },
            { time: eventEnd, value: -1400 }
        ],
        posY: 500,
        // TODO dimensions
        wPx: 300,
        hPx: 300,
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "event-tags",
        content: data.eventTags,
        posX: [
            { time: eventOut, value: outputDimensions.w / 2 },
            { time: eventEnd, value: outputDimensions.w * -1.5 }
        ],
        posY: [
            { time: eventIn, value: 2000 },
            { time: eventContent, value: 1500 }
        ],
        fontName: "Neue Machina Regular",
        fontSizePx: 40,
        textAlign: "center",
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "band-label",
        content: data.bandLabel,
        posX: [
            { time: bandIn, value: outputDimensions.w },
            { time: bandContent, value: 50 },
            { time: bandOut, value: 50 },
            { time: bandEnd, value: -1400 },
        ],
        posY: 150,
        fontName: "Neue Machina Regular",
        fontSizePx: 70,
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "band-desc",
        content: data.bandDesc,
        posX: [
            { time: bandIn + .1, value: outputDimensions.w },
            { time: bandContent, value: 60 },
            { time: bandOut, value: 60 },
            { time: bandEnd, value: -1400 },
        ],
        posY: 300,
        fontName: "Karla Regular",
        fontSizePx: 40,
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "band-stage-time",
        content: data.bandStageTime,
        posX: [
            { time: bandIn + .2, value: outputDimensions.w * 1.5 },
            { time: bandContent, value: outputDimensions.w / 2 },
            { time: bandOut, value: outputDimensions.w / 2 },
            { time: bandEnd, value: outputDimensions.w * -1.5 },
        ],
        posY: 950,
        fontName: "Karla Regular",
        fontSizePx: 40,
        textAlign: "center",
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "band-tags",
        content: data.bandTags,
        posX: [
            { time: bandIn + .3, value: outputDimensions.w * 1.5 },
            { time: bandContent, value: outputDimensions.w / 2 },
            { time: bandOut, value: outputDimensions.w / 2 },
            { time: bandEnd, value: outputDimensions.w * -1.5 },
        ],
        posY: 1050,
        fontName: "Neue Machina Regular",
        fontSizePx: 40,
        textAlign: "center",
        easing: "inOutBack"
    }),
    new ImageVideoElement({
        id: "band-image",
        content: `dynamic/bands/${data.bandImage}`,
        posX: [
            { time: bandOut, value: 0 },
            { time: bandEnd, value: -1400 }
        ],
        posY: [
            { time: bandIn, value: 2000 },
            // TODO same value as img height
            { time: bandContent, value: outputDimensions.h - 100 }
        ],
        // TODO dimensions
        wPx: 100,
        hPx: 100,
        easing: "inOutBack"
    }),
    new ImageVideoElement({
        id: "zz-logo",
        content: "./vidGenAssets/logo_transparent.png",
        posX: 0,
        posY: [
            { time: zzIn + .2, value: -outputDimensions.w },
            { time: zzContent, value: 150 }
        ],
        // TODO dimensions
        wPx: 100,
        hPx: 100,
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "event-date",
        content: data.date,
        posX: [
            { time: zzIn, value: outputDimensions.w * 1.5 },
            { time: zzContent, value: outputDimensions.w / 2 }
        ],
        posY: 1300,
        fontName: "Neue Machina Regular",
        fontSizePx: 60,
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "event-doors",
        content: data.doors,
        posX: [
            { time: zzIn + .1, value: outputDimensions.w * 1.5 },
            { time: zzContent, value: outputDimensions.w / 2 }
        ],
        posY: 1450,
        fontName: "Neue Machina Regular",
        fontSizePx: 60,
        easing: "inOutBack"
    }),
    data.tickets != null ?
        new TextVideoElement({
            id: "event-tickets",
            content: data.tickets,
            posX: [
                { time: zzIn + .2, value: outputDimensions.w * 1.5 },
                { time: zzContent, value: outputDimensions.w / 2 }
            ],
            posY: 1600,
            fontName: "Neue Machina Regular",
            fontSizePx: 60,
            easing: "inOutBack"
        }) : null
];

// NOTE need?
function getImgDimensions(img, type, maxWidth, maxHeight) {
    const imgRatio = img.height / img.width;
    const winRatio = maxHeight / maxWidth;
    /* landscape img */
    if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) return { w: maxWidth, h: maxWidth * imgRatio };
    /* portrait img */
    if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) return { w: maxWidth * winRatio / imgRatio, h: maxHeight };
}