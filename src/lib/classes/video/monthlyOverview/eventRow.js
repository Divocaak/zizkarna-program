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
        * Create a texts holder
        * @param {string} id - id of elements for linking styles with html elements
        * @param {string} label - label of the event
        * @param {Date} date - date of the event
        * @param {string?} tickets - tickets text
        * @param {boolean} userWantsToDimPast - user input from form, does he want to dim past events?
        * @param {boolean} isStatic - static without movement and easing, used for posters and other still graphics
        * @param {boolean} isFirst - if true, without top line
        * @param {boolean} isLast - if true, without bottom padding
    */
    constructor({
        id,
        label,
        date,
        tickets = null,
        userWantsToDimPast = false,
        isStatic = false,
        isFirst = false,
        isLast = false
    }) {
        this.id = id
        this.label = label;
        this.isStatic = isStatic;
        this.userWantsToDimPast = userWantsToDimPast;
        this.isFirst = isFirst;
        this.isLast = isLast;

        const dateLocalised = new Date(date).toLocaleDateString('cs-CZ', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'long'
        });

        this.dateText = `${dateLocalised}${tickets != null ? " (předprodej online)" : ""}`;
    }

    /**
        * Calculates rows total height with default font sizes and padding
        * @param {number} labelFontSize - default label font size
        * @param {number} dateFontSize - default date font size
        * @param {number} labelPadding - default label padding
        * @param {number} datePadding - default date padding
        * @param {number} usableWidth - width to fit object into
        * @param {number} lineHeight - line height ratio
        * @returns {number} - rows default height
    */
    calculateRowHeight({ labelFontSize, dateFontSize, labelPadding, datePadding, usableWidth, lineHeight }) {
        return {
            labelHeight: this.#calculateElementHeight(this.label, labelFontSize, labelPadding, usableWidth, lineHeight),
            dateHeight: this.#calculateElementHeight(this.dateText, dateFontSize, datePadding, usableWidth, lineHeight)
        };
    }

    /**
        * Calculates elements height
        * @param {string} text - text to compute
        * @param {number} fontSize - fontSize to calculate with
        * @param {number} padding - assigned padding
        * @param {number} containerWidth - width to fit object into
        * @param {number} lineHeightRatio - line height ratio
        * @returns {number} - elements height
    */
    #calculateElementHeight(text, fontSize, padding, containerWidth, lineHeightRatio) {
        const lines = Math.ceil(text.length / (containerWidth / (fontSize / 2)));
        return lines * fontSize * lineHeightRatio + padding;
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

        var lineTimes = null
        if (!this.isFirst) lineTimes = createTimes(inputInStart, inputOutStart, lineDelay, lineAnimationLength);

        return {
            label: createTimes(inputInStart, inputOutStart, 0, animationLength),
            date: createTimes(inputInStart, inputOutStart, dateDelay, animationLength),
            line: lineTimes
        };
    }

    /**
        * returns array of complete VideoElements
        * @param {string} parentId - id prefix of partHolder (to recoginse two parts from each other)
        * @param {number} timeInStart - current rows fadeInStart
        * @param {number} timeOutStart - current rows fadeOutStart
        * @param {{date: {fontSize: number, padding: number}, labe: {fontSize: number, padding: number}, topLineLineWidth: number}} dynamicStyles - padding and height for dates and labels and top lines line width
        * @returns {Array<VideoElement>} - array of ready to use VideoElements
    */
    getVideoElements({
        parentId,
        timeInStart = 0,
        timeOutStart = 0,
        dynamicStyles
    }) {
        const color = (this.date < new Date() && this.userWantsToDimPast) ? "#7f7f7f" : "#d4d4d4";

        let lineW = 100;
        let labelX = 0;
        let dateX = 0;
        if (!this.isStatic) {
            const times = this.#calculateTimes(timeInStart, timeOutStart);

            if (!this.isFirst) {
                lineW = [
                    { time: times.line.inStart, value: 0 },
                    { time: times.line.inEnd, value: 100 },
                    { time: times.line.outStart, value: 100 },
                    { time: times.line.outEnd, value: 0 },
                ];
            }

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

        let labelStyles = "position: relative;";
        if (!this.isLast) labelStyles += `padding-bottom: ${dynamicStyles.label.padding}px !important;`;

        const toRet = [
            new TextVideoElement({
                id: `${parentId}-date-${this.id}`,
                content: this.dateText,
                fontName: "Karla Regular",
                fontSizePx: dynamicStyles.date.fontSize,
                fontColor: color,
                textAlign: "left",
                easing: !this.isStatic ? "inOutBack" : null,
                posX: dateX,
                styles: `
                    position: relative;
                    padding-bottom: ${dynamicStyles.date.padding}px !important;
                `
            }),
            new TextVideoElement({
                id: `${parentId}-label-${this.id}`,
                content: this.label,
                fontName: "Neue Machina Regular",
                fontSizePx: dynamicStyles.label.fontSize,
                fontColor: color,
                textAlign: "left",
                easing: !this.isStatic ? "inOutBack" : null,
                posX: labelX,
                styles: labelStyles
            })
        ];

        if (!this.isFirst) {
            toRet.unshift(
                new LineVideoElement({
                    id: `${parentId}-line-${this.id}`,
                    posX: 0,
                    width: lineW,
                    height: dynamicStyles.topLineLineWidth,
                    color: color
                }));
        }

        return toRet;
    }
}
