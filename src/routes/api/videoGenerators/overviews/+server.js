import { ImageVideoElement } from '$lib/classes/video/imageVideoElement.js';
import { MonthlyOverviewEventRow } from '$lib/classes/video/monthlyOverview/eventRow.js';
import { MonthlyOverviewPartHolder } from '$lib/classes/video/monthlyOverview/partHolder.js';
import { TextVideoElement } from '$lib/classes/video/textVideoElement.js';
import { renderTemplate } from '$lib/scripts/videoTemplateGenerator.js';

const eventStartShift = .5;
const eventEndShift = .4;

export async function POST({ request }) {
    const data = await request.json();

    // TODO dynamically by output medium
    const padding = { x: 50, y: 50 };

    const outputMediumOrVidLength = data.outputMediumOrVidLength;
    const isPoster = outputMediumOrVidLength == "a4" || outputMediumOrVidLength == "b0";
    const outputDimensions = {
        w: isPoster ? (outputMediumOrVidLength == "b0" ? 11811 : 2480) : 1080,
        h: isPoster ? (outputMediumOrVidLength == "b0" ? 16701 : 3508) : 1920
    };
    const scalingFactor = {
        w: outputDimensions.w / 1080,
        h: outputDimensions.h / 1920
    }

    // TODO rename
    const legalHalfSplit = data.splitForTwoSections && data.events.length > 1 && !isPoster;

    const middleIndex = Math.floor(data.events.length / 2);
    const finalMiddleIndex = data.events.length % 2 === 0 ? middleIndex : middleIndex + 1;
    const textParts = {
        first: new MonthlyOverviewPartHolder({ id: "first" }),
        second: new MonthlyOverviewPartHolder({ id: "second" })
    };
    data.events.forEach((eventData, index) => {
        const { date, label, tickets } = eventData;
        const textPart = !legalHalfSplit || (index < finalMiddleIndex && legalHalfSplit) ? textParts.first : textParts.second;
        /* BUG */
        textPart.updateHeight(1/* height */);
        textPart.pushRow(new MonthlyOverviewEventRow({
            label: label,
            date: date,
            tickets: tickets,
            scaleFactor: scalingFactor,
            userWantsToDimPast: data.userWantsToDimPast,
            isStatic: isPoster
        }));
    });

    const usableVerticalSpace = outputDimensions.h - (padding.y * 2 * scalingFactor.h);
    textParts.first.calculateBottomPadding(usableVerticalSpace)

    // calculations only for video, which means taht outputMediumOrVidLength is vidLength
    const firstInDuration = textParts.first.getRowsCount() * eventStartShift;
    const firstOutDuration = textParts.first.getRowsCount() * eventEndShift;
    textParts.first.setOutStart(outputMediumOrVidLength - firstOutDuration);
    if (legalHalfSplit) {
        textParts.second.calculateBottomPadding(usableVerticalSpace);

        const contentLenPerSection = (outputMediumOrVidLength - firstInDuration - (textParts.second.getTextsCount() * (eventEndShift + eventStartShift))) / 2;
        const firstGetOutStartNew = textParts.first.getInStart() + firstInDuration + contentLenPerSection;
        textParts.first.setOutStart(firstGetOutStartNew);
        textParts.second.setInStart(firstGetOutStartNew);
        textParts.second.setOutStart(firstGetOutStartNew + firstOutDuration + contentLenPerSection);
    }

    const response = await renderTemplate({
        onlyFrame: data.testFrame,
        duration: outputMediumOrVidLength,
        outputDimensions: outputDimensions,
        scalingFactor: scalingFactor,
        paddingPx: padding,
        videoElements: videoElements({ data: data, scaleFactor: scalingFactor, textParts: textParts })
    });

    return new Response(JSON.stringify({
        output: response,
        /* TODO */
        format: (data.testFrame ? "html" : (true ? "image" : "video"))
    }, { status: 200 }));
}

function renderAllTexts(context, time, w, dimPast, texts, topBorder, eventBottomPadding, times, isPoster, dimensionScaleFactor) {
    let currentTextFadeInStart = times.inStart;
    let currentTextFadeOutStart = times.outStart;

    let currY = topBorder + (eventBottomPadding / 2);

    const lineStartX = w / 2;
    const xPosition = 50 * dimensionScaleFactor.w;

    texts.forEach(eventText => {

        const lineY = currY - (40 * dimensionScaleFactor.h);

        const lineLeftX = isPoster ? xPosition : interpolateKeyframes([
            { time: lineFadeInStart, value: lineStartX },
            { time: lineFadeInEnd, value: xPosition },
            { time: lineFadeOutStart, value: xPosition },
            { time: lineFadeOutEnd, value: lineStartX }
        ], time, "easeInOutQuint");
        const rightLineEnd = w - xPosition;
        const lineRightX = isPoster ? rightLineEnd : interpolateKeyframes([
            { time: lineFadeInStart, value: lineStartX },
            { time: lineFadeInEnd, value: rightLineEnd },
            { time: lineFadeOutStart, value: rightLineEnd },
            { time: lineFadeOutEnd, value: lineStartX }
        ], time, "easeInOutQuint");
        context.beginPath();
        context.moveTo(lineStartX, lineY);
        context.lineTo(lineLeftX, lineY);
        context.moveTo(lineStartX, lineY);
        context.lineTo(lineRightX, lineY);
        context.stroke()

        // label and date calcs and renders

        currY += eventBottomPadding + eventText.height;
        currentTextFadeInStart += eventStartShift;
        currentTextFadeOutStart += eventEndShift;
    });
}

const videoElements = ({ data, scaleFactor, textParts }) => [
    /* TODO logo */
    /* new ImageVideoElement({
        id: "zz-logo",
        content: "./vidGenAssets/logo_transparent.png",
        posX: 0,
        posY: 0
    }), */
    new TextVideoElement({
        id: "poster-label",
        content: data.label,
        posX: 0,
        posY: 0,
        fontName: "Neue Machina Regular",
        fontSizePx: 80 * scaleFactor.h,
        fontColor: "#d4d4d4",
        textAlign: "center",
        styles: "position: relative;"
    }),
    ...textParts.first.getAllVideoElements({ eventFadeInDelay: 0, eventFadeOutDelay: 0 }),
    ...textParts.second.getAllVideoElements({ eventFadeInDelay: 0, eventFadeOutDelay: 0 })
];