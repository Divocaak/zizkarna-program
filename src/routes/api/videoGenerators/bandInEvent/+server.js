import { renderTemplate } from '$lib/scripts/videoTemplateGenerator.js';
import { TextVideoElement } from '$lib/classes/video/textVideoElement.js';
import { ImageVideoElement } from '$lib/classes/video/imageVideoElement.js';
import { PaddingElement } from '$lib/classes/video/paddingHolder.js';

const outputDimensions = { w: 1080, h: 1920 };
const padding = new PaddingElement({ x: 100, y: 250 });

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

    console.log(`
        === CONSTS
        crossfadeTime: ${crossfadeTime}
        fadeTime: ${fadeTime}
        sectionLen: ${sectionLen}
        
        === EVENT
        eventIn: ${eventIn}
        eventContent: ${eventContent}
        eventOut: ${eventOut}
        eventEnd: ${eventEnd}
        
        === BAND
        bandIn: ${bandIn}
        bandContent: ${bandContent}
        bandOut: ${bandOut}
        bandEnd: ${bandEnd}
        
        === LAST
        zzIn: ${zzIn}
        zzContent: ${zzContent}
        
        === DURATION
        duration: ${duration}\n`
    );

    const data = await request.json();

    const response = await renderTemplate({
        onlyFrame: data.testFrame,
        duration: duration,
        outputDimensions: outputDimensions,
        padding: padding,
        videoElements: videoElements(data),
    });

    return new Response(JSON.stringify({
        output: response,
        format: (data.testFrame ? "html" : "video")
    }, { status: 200 }));
}

const videoElements = (data) => [
    new TextVideoElement({
        id: "event-label",
        content: data.eventLabel,
        posX: [
            { time: eventOut, value: 0 },
            { time: eventEnd, value: -1500 }
        ],
        posY: [
            { time: eventIn, value: -400 },
            { time: eventContent, value: 0 }
        ],
        fontName: "Neue Machina Regular",
        fontSizePx: 70,
        easing: "inOutBack",
        lineHeight: 1.14
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
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "event-tags",
        content: data.eventTags,
        posX: [
            { time: eventOut, value: 0 },
            { time: eventEnd, value: outputDimensions.w * -1.5 }
        ],
        posY: [
            { time: eventIn, value: 1920 },
            { time: eventContent, value: 1200 }
        ],
        fontName: "Neue Machina Regular",
        fontSizePx: 40,
        textAlign: "center",
        easing: "inOutBack",
        lineHeight: 1.05
    }),
    new TextVideoElement({
        id: "band-label",
        content: data.bandLabel,
        posX: [
            { time: bandOut, value: 0 },
            { time: bandEnd, value: -1500 }
        ],
        posY: [
            { time: bandIn, value: -400 },
            { time: bandContent, value: 0 }
        ],

        fontName: "Neue Machina Regular",
        fontSizePx: 70,
        easing: "inOutBack",
        lineHeight: 1.1
    }),
    new TextVideoElement({
        id: "band-desc",
        content: data.bandDesc,
        posX: [
            { time: bandIn + .1, value: outputDimensions.w },
            { time: bandContent, value: 0 },
            { time: bandOut, value: 0 },
            { time: bandEnd, value: -1400 },
        ],
        posY: 200,
        fontName: "Karla Regular",
        fontSizePx: 40,
        easing: "inOutBack",
        lineHeight: 1.2
    }),
    new TextVideoElement({
        id: "band-stage-time",
        content: data.bandStageTime,
        posX: [
            { time: bandIn + .2, value: outputDimensions.w },
            { time: bandContent, value: 0 },
            { time: bandOut, value: 0 },
            { time: bandEnd, value: outputDimensions.w * -1.5 },
        ],
        posY: 850,
        fontName: "Karla Regular",
        fontSizePx: 40,
        textAlign: "center",
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "band-tags",
        content: data.bandTags,
        posX: [
            { time: bandIn + .3, value: outputDimensions.w },
            { time: bandContent, value: 0 },
            { time: bandOut, value: 0 },
            { time: bandEnd, value: outputDimensions.w * -1.5 },
        ],
        posY: 950,
        fontName: "Neue Machina Regular",
        fontSizePx: 40,
        textAlign: "center",
        easing: "inOutBack",
        lineHeight: 1.25
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
            { time: bandContent, value: 1310 }
        ],
        easing: "inOutBack"
    }),
    new ImageVideoElement({
        id: "zz-logo",
        content: "./vidGenAssets/logo_transparent.png",
        posX: 0,
        posY: [
            { time: zzIn + .2, value: -outputDimensions.w },
            { time: zzContent, value: padding.getTop() }
        ],
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "event-date",
        content: data.date,
        posX: [
            { time: zzIn, value: outputDimensions.w * 1.5 },
            { time: zzContent, value: 0 }
        ],
        posY: 900,
        fontName: "Neue Machina Regular",
        fontSizePx: 60,
        easing: "inOutBack"
    }),
    new TextVideoElement({
        id: "event-doors",
        content: data.doors,
        posX: [
            { time: zzIn + .1, value: outputDimensions.w * 1.5 },
            { time: zzContent, value: 0 }
        ],
        posY: 1050,
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
                { time: zzContent, value: 0 }
            ],
            posY: 1200,
            fontName: "Neue Machina Regular",
            fontSizePx: 60,
            easing: "inOutBack"
        }) : null
];