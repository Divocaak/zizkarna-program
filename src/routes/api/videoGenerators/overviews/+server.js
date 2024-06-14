import { renderTemplate } from '$lib/scripts/videoTemplateGenerator.js';

const eventStartShift = .5;
const eventEndShift = .4;

export async function POST({ request }) {
    const data = await request.json();

    // TODO dynamically by output medium
    const padding = { x: 100, y: 300 };

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
    const textParts = { first: { height: 0, texts: [] }, second: { height: 0, texts: [] } };
    data.events.forEach((eventData, index) => {
        const { date, label, past, tickets } = eventData;
        const dateMaxWidth = isPoster ? 310 : 200;
        const labelMaxWidth = isPoster ? 210 : 170;
        
        const dateLineHeight = 40 * scalingFactor.h;
        const labelLineHeight = 60 * scalingFactor.h;

        const dateWrapped = getWrappedText(`${date}${tickets != null ? " (předprodej online)" : ""}`, dateMaxWidth, context, dateLineHeight);
        const labelWrapped = getWrappedText(label, labelMaxWidth, context, labelLineHeight);
        const height = (dateWrapped.length * dateLineHeight) + (labelWrapped.length * labelLineHeight);

        const textPart = !legalHalfSplit || (index < finalMiddleIndex && legalHalfSplit) ? textParts.first : textParts.second;
        textPart.height += height;
        textPart.texts.push({ date: dateWrapped, label: labelWrapped, height, past });
    });

    // TODO if used without calculation, remove variable
    const topBorder = padding.y;//250 * scalingFactor.h;
    const usableVerticalSpace = outputDimensions.h - topBorder;
    const eventBottomPadding = [
        ((usableVerticalSpace - textParts.first.height) / textParts.first.texts.length),
        legalHalfSplit ? ((usableVerticalSpace - textParts.second.height) / textParts.second.texts.length) : null
    ];

    // calculations only for video, which means taht outputMediumOrVidLength is vidLength
    const firstOutDuration = textParts.first.texts.length * eventEndShift;
    const firstInDuration = textParts.first.texts.length * eventStartShift;
    const firstHalfTimes = {
        inStart: 0,
        outStart: outputMediumOrVidLength - firstOutDuration
    };

    if (legalHalfSplit) {
        const contentLenPerSection = (outputMediumOrVidLength - firstInDuration - (textParts.second.texts.length * (eventEndShift + eventStartShift))) / 2;
        firstHalfTimes.outStart = firstHalfTimes.inStart + firstInDuration + contentLenPerSection;
        var secondHalfTimes = {
            inStart: firstHalfTimes.outStart,
            outStart: firstHalfTimes.outStart + firstOutDuration + contentLenPerSection,
        };
    }

    const testPage = true;
    const testFrame = false;
    const response = await renderTemplate({
        testPage: testPage,
        duration: outputMediumOrVidLength,
        outputDimensions: outputDimensions,
        scalingFactor: scalingFactor,
        paddingPx: padding,
        videoElements: videoElements(data)
    });

    return new Response(JSON.stringify({
        output: response,
        format: (testPage ? "html" : (testFrame ? "image" : "video"))
    }, { status: 200 }));
}

function renderFrame(context, time, duration, dimensions, dimensionScaleFactor, eventsTexts, topBorder, eventBottomPadding, gradients, noise, logo, label, dimPast, firstTimes, secondTimes = null, isPoster = false) {

    context.drawImage(logo, dimensions.w - (120 * dimensionScaleFactor.w), 0, 150 * dimensionScaleFactor.w, 150 * dimensionScaleFactor.h);

    context.fillStyle = "#d4d4d4";
    const labelFont = 80 * dimensionScaleFactor.h;
    context.font = `${labelFont}px 'Neue Machina Regular'`;
    context.textAlign = "center";
    context.fillText(label, dimensions.w / 2, 125 * dimensionScaleFactor.h);

    renderAllTexts(context, time, dimensions.w, dimPast, eventsTexts[0], topBorder, eventBottomPadding[0], firstTimes, isPoster, dimensionScaleFactor);
    if (secondTimes) {
        renderAllTexts(context, time, dimensions.w, dimPast, eventsTexts[1], topBorder, eventBottomPadding[1], secondTimes, isPoster, dimensionScaleFactor);
    }
}

function renderAllTexts(context, time, w, dimPast, texts, topBorder, eventBottomPadding, times, isPoster, dimensionScaleFactor) {
    let currentTextFadeInStart = times.inStart;
    let currentTextFadeOutStart = times.outStart;

    let currY = topBorder + (eventBottomPadding / 2);

    const dateToLabelSpacer = 60 * dimensionScaleFactor.h;
    const lineStartX = w / 2;
    const xPosition = 50 * dimensionScaleFactor.w;

    const dateFontSize = 40 * dimensionScaleFactor.h;
    const labelFontSize = 50 * dimensionScaleFactor.h;

    context.lineWidth = 3 * dimensionScaleFactor.h;

    texts.forEach(eventText => {
        const lineY = currY - (40 * dimensionScaleFactor.h);

        const textFadeInStart = currentTextFadeInStart;
        const textFadeInEnd = textFadeInStart + 1;
        const textFadeOutStart = currentTextFadeOutStart;
        const textFadeOutEnd = textFadeOutStart + 1;

        const lineFadeInStart = textFadeInStart + .35;
        const lineFadeInEnd = lineFadeInStart + .4;
        const lineFadeOutStart = textFadeOutStart;
        const lineFadeOutEnd = lineFadeOutStart + .4;

        const dateFadeInStart = textFadeInStart + .1;
        const dateFadeInEnd = textFadeInEnd + .1;
        const dateFadeOutStart = textFadeOutStart + .1;
        const dateFadeOutEnd = textFadeOutEnd + .1;

        context.fillStyle = (eventText.past && dimPast) ? "#7f7f7f" : "#d4d4d4";
        context.strokeStyle = (eventText.past && dimPast) ? "#7f7f7f" : "#d4d4d4";

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
        context.stroke();

        const dateX = isPoster ? xPosition : interpolateKeyframes([
            { time: dateFadeInStart, value: 1300 },
            { time: dateFadeInEnd, value: xPosition },
            { time: dateFadeOutStart, value: xPosition },
            { time: dateFadeOutEnd, value: -1000 }
        ], time, "inOutBack");
        context.font = `${dateFontSize}px 'Karla Regular'`;
        context.textAlign = "left";
        eventText.date.forEach(function (item) {
            context.fillText(item[0], dateX, currY + item[1]);
        });

        const labelX = isPoster ? xPosition : interpolateKeyframes([
            { time: textFadeInStart, value: 1300 },
            { time: textFadeInEnd, value: xPosition },
            { time: textFadeOutStart, value: xPosition },
            { time: textFadeOutEnd, value: -1000 },
        ], time, "inOutBack");
        context.font = `${labelFontSize}px 'Neue Machina Regular'`;
        eventText.label.forEach(function (item) {
            context.fillText(item[0], labelX, currY + dateToLabelSpacer + item[1]);
        });

        currY += eventBottomPadding + eventText.height;
        currentTextFadeInStart += eventStartShift;
        currentTextFadeOutStart += eventEndShift;
    });
}

const videoElements = (data) => [
    // TODO static logo
    // TODO static title, with bold pls
];