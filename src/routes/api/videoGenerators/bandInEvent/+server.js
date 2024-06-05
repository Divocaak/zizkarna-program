// NOTE need?
import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';
import path from 'path';

import { renderTemplate } from '$lib/scripts/video/template.js';

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

    // const eventLabelWrapped = getWrappedText(data.eventLabel, 130, context, 80);
    // const eventTagsWrapped = getWrappedText(data.eventTags, 200, context, 50);
    // const poster = await loadImage(`dynamic/events/${data.eventId}.jpg`);
    // const posterDimensions = getImgDimensions(poster, "contain", 1080, 1500);

    // const bandLabelWrapped = getWrappedText(data.bandLabel, 120, context, 70);
    // const bandDescWrapped = getWrappedText(data.bandDesc, 250, context, 50);
    // const bandTagsWrapped = getWrappedText(data.bandTags, 200, context, 50);
    // const bandStageTimeWrapped = getWrappedText(data.bandStageTime, 300, context, 40);
    // const bandImage = await loadImage(`dynamic/bands/${data.bandImage}`);
    // const bandImageDimensions = getImgDimensions(bandImage, "contain", 1080, 1500);

    // const dateWrapped = getWrappedText(data.date, 500, context, 90);
    // const doorsWrapped = getWrappedText(data.doors, 500, context, 90);
    // const ticketsWrapped = data.tickets ? getWrappedText(data.tickets, 100, context, 90) : null;
    // const logo = await loadImage("./vidGenAssets/logo_transparent.png");

    const testPage = true;
    const testFrame = false;
    const response = await renderTemplate({
        testPage: testPage,
        duration: duration,
        paddingPx: {x: 100, y: 250},
        calculations: (time, duration) => console.log(`curr ${time}/${duration}`),
        styles: ".test{color:red;}",
        htmls: "<p class='test'>test tesaasfasfaf</p>"
    });

    return new Response(JSON.stringify({
        output: response,
        format: (testPage ? "html" : (testFrame ? "image" : "video"))
    }, { status: 200 }));
}

function calculations (time, duration){
    
}

function renderFrame(context, time, poster, posterDimensions, eventLabel, eventTags, bandLabel, bandDesc, bandImage, bandImageDimensions, bandTags, bandStageTime, logo = null, date = null, doors = null, tickets = null) {

    //context.fillStyle = "#d4d4d4";

    /* event section */

    /* const eventLabelX = interpolateKeyframes([
        { time: eventOut, value: 50 },
        { time: eventEnd, value: -1500 }
    ], time);
    const eventLabelY = interpolateKeyframes([
        { time: eventIn, value: -200 },
        { time: eventContent, value: 200 }
    ], time);
    context.font = "70px 'Neue Machina Regular'";
    context.textAlign = "left";
    eventLabel.forEach(function (item) {
        context.fillText(item[0], eventLabelX, eventLabelY + item[1]);
    });

    const posterX = interpolateKeyframes([
        { time: eventIn, value: -1400 },
        { time: eventContent, value: 0 },
        { time: eventOut, value: 0 },
        { time: eventEnd, value: -1400 }
    ], time);
    context.drawImage(poster, posterX, 500, posterDimensions.w, posterDimensions.h);

    const eventTagsX = interpolateKeyframes([
        { time: eventOut, value: w / 2 },
        { time: eventEnd, value: 1080 * -1.5 }
    ], time);
    const eventTagsY = interpolateKeyframes([
        { time: eventIn, value: 2000 },
        { time: eventContent, value: 1500 }
    ], time);
    context.font = "40px 'Neue Machina Regular'";
    context.textAlign = "center";
    eventTags.forEach(function (item) {
        context.fillText(item[0], eventTagsX, eventTagsY + item[1]);
    }); */

    /* band section */

    /* const bandLabelX = interpolateKeyframes([
        { time: bandIn, value: 1080 },
        { time: bandContent, value: 50 },
        { time: bandOut, value: 50 },
        { time: bandEnd, value: -1400 },
    ], time);
    context.font = "70px 'Neue Machina Regular'";
    context.textAlign = "left";
    bandLabel.forEach(function (item) {
        context.fillText(item[0], bandLabelX, 150 + item[1]);
    });

    const bandDescX = interpolateKeyframes([
        { time: bandIn + .1, value: 1080 },
        { time: bandContent, value: 60 },
        { time: bandOut, value: 60 },
        { time: bandEnd, value: -1400 },
    ], time);
    context.font = "40px 'Karla Regular'";
    bandDesc.forEach(function (item) {
        context.fillText(item[0], bandDescX, 300 + item[1]);
    });

    const bandStageTimeX = interpolateKeyframes([
        { time: bandIn + .2, value: 1080 * 1.5 },
        { time: bandContent, value: w / 2 },
        { time: bandOut, value: w / 2 },
        { time: bandEnd, value: 1080 * -1.5 },
    ], time);
    context.textAlign = "center";
    bandStageTime.forEach(function (item) {
        context.fillText(item[0], bandStageTimeX, 950 + item[1]);
    });

    const bandTagsX = interpolateKeyframes([
        { time: bandIn + .3, value: 1080 * 1.5 },
        { time: bandContent, value: w / 2 },
        { time: bandOut, value: w / 2 },
        { time: bandEnd, value: 1080 * -1.5 },
    ], time);
    context.font = "40px 'Neue Machina Regular'";
    bandTags.forEach(function (item) {
        context.fillText(item[0], bandTagsX, 1050 + item[1]);
    });

    const bandImageX = interpolateKeyframes([
        { time: bandOut, value: 0 },
        { time: bandEnd, value: -1400 }
    ], time);
    const bandImageY = interpolateKeyframes([
        { time: bandIn, value: 2000 },
        { time: bandContent, value: 1920 - (bandImageDimensions.h) }
    ], time);
    context.drawImage(bandImage, bandImageX, bandImageY, bandImageDimensions.w, bandImageDimensions.h); */

    /* zz section */

    /* if (logo != null) {
        const logoY = interpolateKeyframes([
            { time: zzIn + .2, value: -1080 },
            { time: zzContent, value: 150 }
        ], time);
        context.drawImage(logo, 0, logoY, 1080, 1080);
    }

    if (date != null) {
        const dateX = interpolateKeyframes([
            { time: zzIn, value: 1080 * 1.5 },
            { time: zzContent, value: w / 2 }
        ], time);
        context.font = "60px 'Neue Machina Regular'";
        date.forEach(function (item) {
            context.fillText(item[0], dateX, 1300 + item[1]);
        });
    }

    if (doors != null) {
        const doorsX = interpolateKeyframes([
            { time: zzIn + .1, value: 1080 * 1.5 },
            { time: zzContent, value: w / 2 }
        ], time);
        doors.forEach(function (item) {
            context.fillText(item[0], doorsX, 1450 + item[1]);
        });
    }

    if (tickets != null) {
        const ticketsX = interpolateKeyframes([
            { time: zzIn + .2, value: 1080 * 1.5 },
            { time: zzContent, value: w / 2 }
        ], time);
        tickets.forEach(function (item) {
            context.fillText(item[0], ticketsX, 1600 + item[1]);
        });
    } */
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