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
    const outputDimensions = {
        w: data.isPoster ? (outputMediumOrVidLength == "b0" ? 11811 : 2480) : 1080,
        h: data.isPoster ? (outputMediumOrVidLength == "b0" ? 16701 : 3508) : 1920
    };

    const scalingFactor = {
        w: outputDimensions.w / 1080,
        h: outputDimensions.h / 1920
    }

    const padding = !data.isPoster
        ? outputMediumOrVidLength < 10
            ? new PaddingElement({ x: 100, y: 250 }) // story
            : new PaddingElement({ x: 50, y: { top: 220, bottom: 420 } }) // reel
        : outputMediumOrVidLength == "a4"
            ? new PaddingElement({ x: 178, y: 178 }) // a4
            : new PaddingElement({ x: 590, y: 590 }); // b0

    const usableSpace = {
        w: outputDimensions.w - (padding.getX() * scalingFactor.w),
        h: outputDimensions.h - (padding.getY() * scalingFactor.h)
    }

    const twoSections = data.splitForTwoSections && data.events.length > 1 && !data.isPoster;

    const middleIndex = Math.floor(data.events.length / 2);
    const finalMiddleIndex = data.events.length % 2 === 0 ? middleIndex : middleIndex + 1;
    const textParts = {
        first: new MonthlyOverviewPartHolder({
            id: "first",
            usableSpace: usableSpace,
            rowsCount: twoSections ? finalMiddleIndex : data.events.length
        }),
        second: new MonthlyOverviewPartHolder({
            id: "second",
            usableSpace: usableSpace,
            rowsCount: data.events.length - finalMiddleIndex,
            isSecondPart: true
        })
    };
    data.events.forEach((eventData, index) => {
        const { date, label, tickets } = eventData;

        const textPart = !twoSections || (index < finalMiddleIndex && twoSections) ? textParts.first : textParts.second;

        const isLast = index === data.events.length - 1 || (twoSections && index === finalMiddleIndex - 1);
        textPart.pushRow({
            newRow: new MonthlyOverviewEventRow({
                id: index,
                label: label,
                date: date,
                tickets: tickets,
                userWantsToDimPast: data.dimPastEvents,
                isStatic: data.isPoster,
                isFirst: index === 0 || (twoSections && index === finalMiddleIndex),
                isLast: isLast
            }),
            isLast: isLast
        });
    });

    // calculations only for video, which means taht outputMediumOrVidLength is vidLength
    const firstInDuration = textParts.first.getRowsCount() * eventStartShift;
    const firstOutDuration = textParts.first.getRowsCount() * eventEndShift;
    textParts.first.setOutStart(outputMediumOrVidLength - firstOutDuration);
    if (twoSections) {
        const contentLenPerSection = (outputMediumOrVidLength - firstInDuration - (textParts.second.getRowsCount() * (eventEndShift + eventStartShift))) / 2;
        const firstGetOutStartNew = textParts.first.getInStart() + firstInDuration + contentLenPerSection;
        textParts.first.setOutStart(firstGetOutStartNew);
        textParts.second.setInStart(firstGetOutStartNew);
        textParts.second.setOutStart(firstGetOutStartNew + firstOutDuration + contentLenPerSection);
    }

    const response = await renderTemplate({
        onlyFrame: data.testFrame,
        duration: outputMediumOrVidLength,
        outputDimensions: outputDimensions,
        padding: padding,
        overviewPoster: data.isPoster,
        videoElements: videoElements({
            label: data.label,
            labelFontSize: 80 * scalingFactor.h,
            scaleFactor: scalingFactor,
            twoSections: twoSections,
            textParts: textParts,
            outputDimensions: outputDimensions,
            padding: padding,
        })
    });

    return new Response(JSON.stringify({
        output: response,
        format: (data.testFrame ? "html" : (data.isPoster ? "image" : "video"))
    }, { status: 200 }));
}

const videoElements = ({
    label,
    labelFontSize,
    scaleFactor,
    twoSections,
    textParts,
    outputDimensions,
    padding,
}) => {
    const logoScale = 150
    const logoW = logoScale * scaleFactor.w;
    const logoH = logoScale * scaleFactor.h;

    const eventFadeInDelay = .25;
    const eventFadeOutDelay = .1;
    const outputWidth = outputDimensions.w - padding.x;
    const dynamicStyles = textParts.first.createPartVideoObjects({
        eventFadeInDelay: eventFadeInDelay,
        eventFadeOutDelay: eventFadeOutDelay,
        outputWidth: outputWidth
    });
    const toRet = [
        new ImageVideoElement({
            id: "zz-logo",
            content: "./vidGenAssets/logo_transparent.png",
            posX: outputDimensions.w - padding.getRight() - logoW,
            posY: padding.getTop() - logoH * .25,
            wPx: logoW,
            hPx: logoH
        }),
        new TextVideoElement({
            id: "poster-label",
            content: label,
            posX: 0,
            posY: 0,
            fontName: "Neue Machina Regular",
            fontSizePx: labelFontSize,
            fontColor: "#d4d4d4",
            textAlign: "center"
        }),
        textParts.first
    ];

    if (twoSections) {
        textParts.second.createPartVideoObjects({
            eventFadeInDelay: eventFadeInDelay,
            eventFadeOutDelay: eventFadeOutDelay,
            outputWidth: outputWidth,
            dynamicStyles: dynamicStyles
        });
        toRet.push(textParts.second);
    }

    return toRet;
};