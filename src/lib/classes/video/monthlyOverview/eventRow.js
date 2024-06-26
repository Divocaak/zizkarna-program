import { TextVideoElement } from "$lib/classes/video/textVideoElement";
import { VideoElement } from "$lib/classes/video/videoElement";
import { LineVideoElement } from "$lib/classes/video/monthlyOverview/lineVideoElement";

/**
    * Represents a holder for single event, date + presale and line
    * with all necessary data to create video elements
    * @class
*/
export class MonthlyOverviewEventRow {
    /**
        * date font size
        * @type {number}
        * @private
    */
    #dateFontSize;

    /**
        * label font size
        * @type {number}
        * @private
    */
    #labelFontSize;

    /**
        * top line height
        * @type {number}
        * @private
    */
    #topLineHeight;

    /**
        * Bottom padding of date
        * @type {number}
        * @private
    */
    #dateBottomPadding;

    /**
        * Bottom padding of label
        * @type {number}
        * @private
    */
    #labelBottomPadding;

    /**
        * Create a texts holder
        * @param {string} id - id of elements for linking styles with html elements
        * @param {string} label - label of the event
        * @param {Date} date - date of the event
        * @param {string?} tickets - tickets text
        * @param {boolean} userWantsToDimPast - user input from form, does he want to dim past events?
        * @param {boolean} isStatic - static without movement and easing, used for posters and other still graphics
    */
    constructor({
        id,
        label,
        date,
        tickets = null,
        userWantsToDimPast = false,
        isStatic = false
    }) {
        this.id = id
        this.label = label;
        this.date = new Date(date);
        this.tickets = tickets
        this.isStatic = isStatic;
        this.userWantsToDimPast = userWantsToDimPast;
        this.#dateFontSize = 27;
        this.#labelFontSize = 40;
        this.#topLineHeight = 1;
        this.#labelBottomPadding = 40;
        this.#dateBottomPadding = 10;
    }

    /**
        * Calculates rows total height with default font sizes and padding
        * @param {number} usableWidth - max width of row
        * @returns {number} - rows default height
    */
    calculateRowHeight(usableWidth) {
        const averageCharWidthFactor = 0.6;

        let currentLine = '';
        const words = this.label.split(' ');
        const lines = [];

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const testLineWidth = testLine.length * this.#labelFontSize * averageCharWidthFactor;

            if (testLineWidth > usableWidth && currentLine.length > 0) {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });

        lines.push(currentLine.trim());

        const defaultLineHeight = 1.2;
        const labelHeight = (lines.length * this.#labelFontSize * defaultLineHeight) + this.#labelBottomPadding;
        const dateHeight = (this.#dateFontSize * defaultLineHeight) + this.#dateBottomPadding;
        return labelHeight + dateHeight + this.#topLineHeight;
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
        * @param {string} parentId - id prefix of partHolder (to recoginse two parts from each other)
        * @param {number} timeInStart - current rows fadeInStart
        * @param {number} timeOutStart - current rows fadeOutStart
        * @param {number} yMultiplier - calculated value used to fit everything in container, multiply everything ywise with it
        * @returns {Array<VideoElement>} - array of ready to use VideoElements
    */
    getVideoElements({
        parentId,
        timeInStart = 0,
        timeOutStart = 0,
        yMultiplier = 1
    }) {
        const color = (this.date < new Date() && this.userWantsToDimPast) ? "#7f7f7f" : "#d4d4d4";

        const dateLocalised = this.date.toLocaleDateString('cs-CZ', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'long'
        });

        let lineW = 100;
        let labelX = 0;
        let dateX = 0;
        if (!this.isStatic) {
            const times = this.#calculateTimes(timeInStart, timeOutStart);
            lineW = [
                { time: times.line.inStart, value: 0 },
                { time: times.line.inEnd, value: 100 },
                { time: times.line.outStart, value: 100 },
                { time: times.line.outEnd, value: 0 },
            ];
            labelX = [
                { time: times.label.inStart, value: 1300 },
                { time: times.label.inEnd, value: 0 },
                { time: times.label.outStart, value: 0 },
                { time: times.label.outEnd, value: -1000 },
            ];
            dateX = [
                { time: times.date.inStart, value: 1300 },
                { time: times.date.inEnd, value: 0 },
                { time: times.date.outStart, value: 0 },
                { time: times.date.outEnd, value: -1000 }
            ];
        }

        return [
            new LineVideoElement({
                id: `${parentId}-line-${this.id}`,
                posX: 0,
                width: lineW,
                height: this.#topLineHeight,
                color: color
            }),
            new TextVideoElement({
                id: `${parentId}-date-${this.id}`,
                content: `${dateLocalised}${this.tickets != null ? " (předprodej online)" : ""}`,
                fontName: "Karla Regular",
                fontSizePx: this.#dateFontSize * yMultiplier,
                fontColor: color,
                textAlign: "left",
                easing: !this.isStatic ? "inOutBack" : null,
                posX: dateX,
                styles: `
                    position: relative;
                    padding-bottom: ${this.#dateBottomPadding * yMultiplier}px !important;
                `
            }),
            new TextVideoElement({
                id: `${parentId}-label-${this.id}`,
                content: this.label,
                fontName: "Neue Machina Regular",
                fontSizePx: this.#labelFontSize * yMultiplier,
                fontColor: color,
                textAlign: "left",
                easing: !this.isStatic ? "inOutBack" : null,
                posX: labelX,
                styles: `
                    position: relative;
                    padding-bottom: ${this.#labelBottomPadding * yMultiplier}px !important;
                `
            })
        ];
    }
}
