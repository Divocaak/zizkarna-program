import { TextVideoElement } from "$lib/classes/video/textVideoElement";
import { VideoElement } from "$lib/classes/video/videoElement";

/**
    * Represents a holder for single event, date + presale and line
    * with all necessary data to create video elements
    * @class
*/
export class MonthlyOverviewEventRow {
    /**
        * Create a texts holder
        * @param {string} id - id of elements for linking styles with html elements
        * @param {string} label - label of the event
        * @param {Date} date - date of the event
        * @param {string?} tickets - tickets text
        * @param {Array<number>} scaleFactor - scale factor for size and position calculations
        * @param {boolean} userWantsToDimPast - user input from form, does he want to dim past events?
        * @param {boolean} isStatic - static without movement and easing, used for posters and other still graphics
    */
    constructor({
        id,
        label,
        date,
        tickets = null,
        scaleFactor = { w: 1, h: 1 },
        userWantsToDimPast = false,
        isStatic = false
    }) {
        this.id = id
        this.label = label;
        this.date = new Date(date);
        this.tickets = tickets
        this.scaleFactor = scaleFactor;
        this.isStatic = isStatic;
        this.userWantsToDimPast = userWantsToDimPast;
        // calc if needed, otherwise delete
        /* this.#height = 0; */
        /* const height = (dateWrapped.length * dateLineHeight) + (labelWrapped.length * labelLineHeight); */
    }

    /**
        * Calculates the fade in and out, start and end times for label, date and line
        * @param {number} inputInStart - current inputIn (relative to last row)
        * @param {number} inputOutStart - current inputOut (relative to last row)
        * @returns {Array<*>} - array of calculated times sorted by object they belong to
    */
    #calculateTimes(inputInStart, inputOutStart) {
        const dateDelay = .1;
        const animationLength = 1;
        const lineDelay = .35;
        const lineAnimationLength = .4;

        const createTimes = (inStart, outStart, delay, length) => ({
            inStart: inStart + delay,
            inEnd: inStart + delay + length,
            outStart: outStart + delay,
            outEnd: outStart + delay + length,
        });

        return {
            label: createTimes(inputInStart, inputOutStart, 0, animationLength),
            date: createTimes(inputInStart, inputOutStart, dateDelay, animationLength),
            line: createTimes(inputInStart, inputOutStart, lineDelay, lineAnimationLength),
        };
    }

    /**
        * returns array of complete VideoElements
        * @param {string} id - id prefix of partHolder (to recoginse two parts from each other)
        * @param {number} currentYPosition - y position for row whole row
        * @param {number} timeInStart - current rows fadeInStart
        * @param {number} timeOutStart - current rows fadeOutStart
        * @param {number} bottomPadding - current rows bottom padding
        * @returns {Array<VideoElement>} - array of ready to use VideoElements
    */
    getVideoElements({
        id,
        timeInStart = 0,
        timeOutStart = 0,
        /* NOTE mby delete, not using since positions are relative */
        //currentYPosition = 0,
        bottomPadding = 0

    }) {
        const color = (this.date < new Date() && this.userWantsToDimPast) ? "#7f7f7f" : "#d4d4d4";

        const dateLocalised = this.date.toLocaleDateString('cs-CZ', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'long'
        });

        /* NOTE do i need it?? */
        const xPosition = 0;
        let labelX = xPosition;
        let dateX = xPosition;
        if (!this.isStatic) {
            const times = this.#calculateTimes(timeInStart, timeOutStart);
            labelX = [
                { time: times.label.inStart, value: 1300 },
                { time: times.label.inEnd, value: xPosition },
                { time: times.label.outStart, value: xPosition },
                { time: times.label.outEnd, value: -1000 },
            ];
            dateX = [
                { time: times.date.inStart, value: 1300 },
                { time: times.date.inEnd, value: xPosition },
                { time: times.date.outStart, value: xPosition },
                { time: times.date.outEnd, value: -1000 }
            ];
        }

        //const dateToLabelSpacer = 0;//(currentYPosition + 0) * this.scaleFactor.h;
        //const dateToLabelSpacer = (currentYPosition + 60) * this.scaleFactor.h;
        return [
            /* TODO line */
            new TextVideoElement({
                id: `${id}-date`,
                content: `${dateLocalised}${this.tickets != null ? " (předprodej online)" : ""}`,
                fontName: "Karla Regular",
                fontSizePx: 40 * this.scaleFactor.h,
                fontColor: color,
                textAlign: "left",
                easing: !this.isStatic ? "inOutBack" : null,
                posX: dateX,
                //posY: currentYPosition,
                //lineHeight: 40 * this.scaleFactor.h
                styles: `
                    position: relative;
                `
            }),
            new TextVideoElement({
                id: `${id}-label`,
                content: this.label,
                fontName: "Neue Machina Regular",
                fontSizePx: 50 * this.scaleFactor.h,
                fontColor: color,
                textAlign: "left",
                easing: !this.isStatic ? "inOutBack" : null,
                posX: labelX,
                //posY: dateToLabelSpacer,
                //lineHeight: 60 * this.scaleFactor.h
                styles: `
                    position: relative;
                    padding-bottom: ${bottomPadding}px !important;
                    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
                `
            })
        ];
    }
}
