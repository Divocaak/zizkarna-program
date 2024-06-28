import { ImageVideoElement } from '$lib/classes/video/imageVideoElement.js';
import { MonthlyOverviewEventRow } from '$lib/classes/video/monthlyOverview/eventRow.js';
import { MonthlyOverviewPartHolder } from '$lib/classes/video/monthlyOverview/partHolder.js';
import { PaddingElement } from '$lib/classes/video/paddingHolder.js';
import { TextVideoElement } from '$lib/classes/video/textVideoElement.js';
import { renderTemplate } from '$lib/scripts/videoTemplateGenerator.js';

const eventStartShift = .5;
const eventEndShift = .4;

export async function POST({ request }) {
    const data = await request.json();

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

    const padding = !isPoster
        ? outputMediumOrVidLength < 10
            ? new PaddingElement({ x: 100, y: 250 }) // story
            : new PaddingElement({ x: 50, y: { top: 220, bottom: 420 } }) // reel
        : outputMediumOrVidLength == "a4"
            ? new PaddingElement({ x: 178, y: 178 }) // a4
            : new PaddingElement({ x: 590, y: 590 }); // b0

    const usableDimensions = {
        w: outputDimensions.w - (padding.getX() * scalingFactor.w),
        h: outputDimensions.h - (padding.getY() * scalingFactor.h)
    }

    const twoSections = data.splitForTwoSections && data.events.length > 1 && !isPoster;

    const middleIndex = Math.floor(data.events.length / 2);
    const finalMiddleIndex = data.events.length % 2 === 0 ? middleIndex : middleIndex + 1;
    const textParts = {
        first: new MonthlyOverviewPartHolder({ id: "first" }),
        second: new MonthlyOverviewPartHolder({ id: "second" })
    };
    data.events.forEach((eventData, index) => {
        const { date, label, tickets } = eventData;
        const textPart = !twoSections || (index < finalMiddleIndex && twoSections) ? textParts.first : textParts.second;
        textPart.pushRow(new MonthlyOverviewEventRow({
            id: index,
            label: label,
            date: date,
            tickets: tickets,
            userWantsToDimPast: data.userWantsToDimPast,
            isStatic: isPoster,
            isFirst: index === 0,
            isLast: index === data.events.length - 1
        }));
    });

    // calculations only for video, which means taht outputMediumOrVidLength is vidLength
    const firstInDuration = textParts.first.getRowsCount() * eventStartShift;
    const firstOutDuration = textParts.first.getRowsCount() * eventEndShift;
    textParts.first.setOutStart(outputMediumOrVidLength - firstOutDuration);
    if (twoSections) {
        const contentLenPerSection = (outputMediumOrVidLength - firstInDuration - (textParts.second.getTextsCount() * (eventEndShift + eventStartShift))) / 2;
        const firstGetOutStartNew = textParts.first.getInStart() + firstInDuration + contentLenPerSection;
        textParts.first.setOutStart(firstGetOutStartNew);
        textParts.second.setInStart(firstGetOutStartNew);
        textParts.second.setOutStart(firstGetOutStartNew + firstOutDuration + contentLenPerSection);
    }

    const labelFontSize = 80 * scalingFactor.h;
    const response = await renderTemplate({
        onlyFrame: data.testFrame,
        duration: outputMediumOrVidLength,
        outputDimensions: outputDimensions,
        scalingFactor: scalingFactor,
        padding: padding,
        videoElements: videoElements({
            data: data,
            scaleFactor: scalingFactor,
            textParts: textParts,
            outputDimensions: outputDimensions,
            padding: padding,
            usableDimensions: usableDimensions,
            labelFontSize: labelFontSize
        }),
        additionalInnerContainerStyles: `
            padding-top: ${labelFontSize}px;
            display: flex;
            justify-content: center;
            flex-direction: column;
        `
    });

    return new Response(JSON.stringify({
        output: response,
        /* TODO _final */
        format: (data.testFrame ? "html" : (true ? "image" : "video"))
    }, { status: 200 }));
}

const videoElements = ({ data, scaleFactor, textParts, outputDimensions, padding, usableDimensions, labelFontSize }) => {
    const logoScale = 150
    const logoW = logoScale * scaleFactor.w;
    const logoH = logoScale * scaleFactor.h;
    return [
        new ImageVideoElement({
            id: "zz-logo",
            content: "./vidGenAssets/logo_transparent.png",
            posX: outputDimensions.w - padding.getRight() - logoW,
            posY: padding.getTop() - labelFontSize,
            wPx: logoW,
            hPx: logoH
        }),
        new TextVideoElement({
            id: "poster-label",
            content: data.label,
            posX: 0,
            posY: 0,
            fontName: "Neue Machina Regular",
            fontSizePx: labelFontSize,
            fontColor: "#d4d4d4",
            textAlign: "center"
        }),
        ...textParts.first.getAllVideoElements({
            usableSpace: usableDimensions,
            eventFadeInDelay: 0,
            eventFadeOutDelay: 0
        }),
        ...textParts.second.getAllVideoElements({
            usableSpace: usableDimensions,
            eventFadeInDelay: 0,
            eventFadeOutDelay: 0
        })
    ]
};