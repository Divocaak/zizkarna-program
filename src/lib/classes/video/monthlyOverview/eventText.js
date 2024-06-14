import { TextVideoElement } from "$lib/classes/video/textVideoElement";
import { VideoElement } from "$lib/classes/video/videoElement";

/**
    * Represents a holder for single event, date + presale and line
    * with all necessary data to create video elements
    * @class
*/
export class MonthlyOverviewEventText {
    /**
        * Create a texts holder
        * @param {string} id - id of elements for linking styles with html elements
        * @param {string} label - label of the event
        * @param {Date} date - date of the event
        * @param {string?} tickets - tickets address
    */
    constructor({
        id,
        label,
        date,
        tickets = null
    }) {
        this.id = id
        this.label = label;
        this.date = new Date(date);
        this.tickets = tickets
        // calc if needed, otherwise delete
        /* this.#height = 0; */
        /* const height = (dateWrapped.length * dateLineHeight) + (labelWrapped.length * labelLineHeight); */
    }

    /* NOTE parameters upon usage: currentTextFadeInStart, currentTextFadeOutStart */
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
        * @param {boolean} userWantsToDimPast - user input from form, does he want to dim past events?
        * @param {number} timeInStart - current rows fadeInStart
        * @param {number} timeOutStart - current rows fadeOutStart
        * @param {boolean} isStatic - static without movement and easing, used for posters and other still graphics
        * @returns {Array<VideoElement>} - array of ready to use VideoElements
    */
    getVideoElements({
        userWantsToDimPast = false,
        timeInStart = 0,
        timeOutStart = 0,
        isStatic = false
    }) {
        const color = (this.date < new Date() && userWantsToDimPast) ? "#7f7f7f" : "#d4d4d4";
        const dateLocalised = this.date.toLocaleDateString('cs-CZ', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'long'
        });

        const dateToLabelSpacer = 0;
        /* TODO where do i get this var */
        const currentYPosition = 0;
        /* TODO where do i get this var */
        /* and do i need it?? */
        const xPosition = 0;
        let dateX = xPosition;
        let labelX = xPosition;
        if (!isStatic) {
            const times = this.#calculateTimes(timeInStart, timeOutStart);
            dateX = [
                { time: times.date.inStart, value: 1300 },
                { time: times.date.inEnd, value: xPosition },
                { time: times.date.outStart, value: xPosition },
                { time: times.date.outEnd, value: -1000 }
            ];
            labelX = [
                { time: times.label.inStart, value: 1300 },
                { time: times.label.inEnd, value: xPosition },
                { time: times.label.outStart, value: xPosition },
                { time: times.label.outEnd, value: -1000 },
            ];
        }

        return [
            new TextVideoElement({
                id: `${id}-label`,
                content: this.label,
                fontName: "Neue Machina Regular",
                /* TODO fontSize */
                fontColor: color,
                textAlign: "center",
                easing: !isStatic ? "inOutBack" : null,
                posX: labelX,
                posY: currentYPosition + dateToLabelSpacer
            }),
            new TextVideoElement({
                id: `${id}-date`,
                content: dateLocalised,
                fontName: "Karla Regular",
                /* TODO fontSize */
                fontColor: color,
                textAlign: "left",
                easing: !isStatic ? "inOutBack" : null,
                posX: dateX,
                posY: currentYPosition
            }),
            /* TODO line */
        ];
    }
}
