import { TextVideoElement } from "$lib/classes/video/textVideoElement";
import { VideoElement } from "$lib/classes/video/videoElement";
import { LineVideoElement } from "$lib/classes/video/monthlyOverview/lineVideoElement";;

/**
    * Represents a holder for single event, date + presale and line
    * with all necessary data to create video elements
    * @class
*/
export class MonthlyOverviewEventRow extends VideoElement {

    /**
        * Video Element of the line object
        * @type {LineVideoElement}
        * @private
    */
    #lineVideoObject;

    /**
        * Video Element of the label object
        * @type {TextVideoElement}
        * @private
    */
    #labelVideoObject;

    /**
        * Video Element of the date object
        * @type {TextVideoElement}
        * @private
    */
    #dateVideoObject;

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
        super({ id });
        this.label = label;
        this.isStatic = isStatic;
        this.userWantsToDimPast = userWantsToDimPast;
        this.isFirst = isFirst;
        this.isLast = isLast;

        this.date = new Date(date);
        const dateLocalised = this.date.toLocaleDateString('cs-CZ', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'long'
        });

        this.dateText = `${dateLocalised}${tickets != null ? " (předprodej online)" : ""}`;
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

        var lineTimes = null;
        if (!this.isFirst) lineTimes = createTimes(inputInStart, inputOutStart, lineDelay, lineAnimationLength);

        return {
            label: createTimes(inputInStart, inputOutStart, 0, animationLength),
            date: createTimes(inputInStart, inputOutStart, dateDelay, animationLength),
            line: lineTimes
        };
    }

    /** 
        * Creates the VideoObjects of this row
         * @param {string} parentId - id prefix of partHolder (to recoginse two parts from each other)
         * @param {number} timeInStart - row animation in start time
         * @param {number} timeOutStart - row animation out start time
         * @param {RowDynamicStyles} dynamicStyles - DynamicStyles to use
         * @param {number} outputWidth - canvases width
     */
    createVideoObjects({
        parentId,
        timeInStart = 0,
        timeOutStart = 0,
        dynamicStyles,
        outputWidth
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
                { time: times.label.inStart, value: outputWidth },
                { time: times.label.inEnd, value: 0 },
                { time: times.label.outStart, value: 0 },
                { time: times.label.outEnd, value: -1000 },
            ];
            dateX = [
                { time: times.date.inStart, value: outputWidth },
                { time: times.date.inEnd, value: 0 },
                { time: times.date.outStart, value: 0 },
                { time: times.date.outEnd, value: -1000 }
            ];
        }

        let labelStyles = "position: relative;";
        if (!this.isLast) labelStyles += `padding-bottom: ${dynamicStyles.getPadding("label")}px !important;`;

        this.#dateVideoObject =
            new TextVideoElement({
                id: `${parentId}-date-${super.getId()}`,
                content: this.dateText,
                fontName: "Karla Regular",
                fontSizePx: dynamicStyles.getFontSize("date"),
                fontColor: color,
                textAlign: "left",
                easing: !this.isStatic ? "inOutBack" : null,
                posX: dateX,
                styles: `
                    position: relative;
                    padding-bottom: ${dynamicStyles.getPadding("date")}px !important;
                `
            });

        this.#labelVideoObject = new TextVideoElement({
            id: `${parentId}-label-${super.getId()}`,
            content: this.label,
            fontName: "Neue Machina Regular",
            fontSizePx: dynamicStyles.getFontSize("label"),
            fontColor: color,
            textAlign: "left",
            easing: !this.isStatic ? "inOutBack" : null,
            posX: labelX,
            styles: labelStyles
        });

        if (!this.isFirst) {
            this.#lineVideoObject = new LineVideoElement({
                id: `${parentId}-line-${super.getId()}`,
                posX: 0,
                width: lineW,
                height: dynamicStyles.getTopLineLineWidth(),
                color: color
            });
        }
    }

    /**
        * Get the css for html template, including all rows elements
        * @param {number} time - time for calculations based on keyframes
        * @returns {string} The css of the element
    */
    getStyles(time) {
        let toRet = !this.isFirst ? this.#lineVideoObject.getStyles(time) : "";
        toRet += this.#dateVideoObject.getStyles(time);
        toRet += this.#labelVideoObject.getStyles(time);
        return toRet;
    }

    /**
        * Get the rows html code, including all its elements
        * @returns {string} The html code to be used in video generator template
    */
    getHtml() {
        let toRet = !this.isFirst ? this.#lineVideoObject.getHtml() : "";
        toRet += this.#dateVideoObject.getHtml();
        toRet += this.#labelVideoObject.getHtml();
        return toRet;
    }
}
