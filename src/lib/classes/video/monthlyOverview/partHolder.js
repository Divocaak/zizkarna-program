import { MonthlyOverviewEventRow } from "$lib/classes/video/monthlyOverview/eventRow.js";
import { VideoElement } from "../videoElement";

/**
    * Represents a holder for half/all texts in monthly overview
    * with all necessary data to control section times and padding
    * @class
*/
export class MonthlyOverviewPartHolder extends VideoElement {
    /**
        * Texts to render
        * @type {Array<MonthlyOverviewEventRow>}
        * @private
    */
    #rows;

    /**
        * Fade-in start time
        * @type {number}
        * @private
    */
    #inStart;

    /**
        * Fade-out start time
        * @type {number}
        * @private
    */
    #outStart;

    /**
        * Create a texts holder
        * variables are meant to be assigned only through set methods
        * @param {string} id - id of part holder to distinguish parts from each other
    */
    constructor({ id }) {
        super({ id });
        this.#rows = [];
        this.#inStart = 0;
        this.#outStart = 0;
    }

    /**
        * Pushes new row to rows
        * @param {MonthlyOverviewEventRow} newRow - row to be pushed
    */
    pushRow(newRow) {
        this.#rows.push(newRow);
    }

    /**
        * returns rows count
        * @returns {number} the count of the rows
    */
    getRowsCount() {
        return this.#rows.length;
    }

    /**
        * Sets inStart
        * @param {number} newVal - new value
    */
    setInStart(newVal) {
        this.#inStart = newVal;
    }

    /**
        * returns inStart
        * @returns {number} the time when fade in starts
    */
    getInStart() {
        return this.#inStart;
    }

    /**
        * Sets outStart
        * @param {number} newVal - new value
    */
    setOutStart(newVal) {
        this.#outStart = newVal;
    }

    /**
        * returns outStart
        * @returns {number} the time when fade out starts
    */
    getOutStart() {
        return this.#outStart;
    }

    /**
        * Calculates the padding and font sizes for dates and labels and top lines line width
        * @param {Array<*>} usableSpace - usable space for the texts
        * @returns {{date: {fontSize: number, padding: number}, labe: {fontSize: number, padding: number}, topLineLineWidth: number}} final dimensions for dates and labels padding and font size and top lines line width
    */
    #calculateDynamicStyles({ usableSpace }) {
        const minPadding = 10;
        const maxPadding = 200;

        const topLineDefaultLineWidth = 5;
        const topLineMinLineWidth = 1;
        const topLineMaxLineWidth = 3;

        const ratios = { dateFontSize: .7, datePadding: 0.5, lineHeight: 1.2 };
        const availableHeightPerElement = usableSpace.h / this.getRowsCount();

        let maxLabelHeight = 0;
        let labelFontSize = availableHeightPerElement / (1 + ratios.lineHeight);
        let labelPadding = Math.max(minPadding, Math.min(availableHeightPerElement * 0.1, maxPadding));

        let maxDateHeight = 0;
        let dateFontSize = labelFontSize * ratios.dateFontSize;
        let datePadding = labelPadding * ratios.datePadding;

        this.#rows.forEach(row => {
            const values = row.calculateRowHeight({
                labelFontSize: labelFontSize,
                dateFontSize: dateFontSize,
                labelPadding: labelPadding,
                datePadding: datePadding,
                usableWidth: usableSpace.w,
                lineHeight: ratios.lineHeight
            });
            maxLabelHeight = Math.max(maxLabelHeight, values.labelHeight);
            maxDateHeight = Math.max(maxDateHeight, values.dateHeight);
        });

        const maxHeight = Math.max(maxLabelHeight, maxDateHeight);
        const scaleRatio = maxHeight > availableHeightPerElement ? availableHeightPerElement / maxHeight : 1;
        labelFontSize *= scaleRatio;
        dateFontSize *= scaleRatio;
        labelPadding = Math.min(labelPadding/*  * scaleRatio */, maxPadding);
        datePadding = Math.min(datePadding/*  * scaleRatio */, maxPadding);

        const topLineLineWidth = Math.max(topLineMinLineWidth, Math.min(topLineMaxLineWidth, (topLineDefaultLineWidth * scaleRatio)));

        return {
            date: { fontSize: dateFontSize, padding: datePadding },
            label: { fontSize: labelFontSize, padding: labelPadding },
            topLineLineWidth: topLineLineWidth
        };
    }

    /** 
        * returns array of ready to use video elements for all events in part
        * @param {Array<*>} usableSpace - usable space for the texts
        * @returns {Array<VideoElement>} the time when fade out starts
    */
    /* DOC */
    createRowsVideoObjectsAndReturnDynamicStyles({
        usableSpace,
        eventFadeInDelay = 0,
        eventFadeOutDelay = 0,
        dynamicStyles = this.#calculateDynamicStyles({ usableSpace: usableSpace })
    }) {
        let currentRowFadeInStart = this.#inStart;
        let currentRowFadeOutStart = this.#outStart;

        this.#rows.forEach(eventRow => {
            eventRow.createVideoObjects({
                parentId: this.id,
                timeInStart: currentRowFadeInStart,
                timeOutStart: currentRowFadeOutStart,
                dynamicStyles: dynamicStyles
            });

            currentRowFadeInStart += eventFadeInDelay;
            currentRowFadeOutStart += eventFadeOutDelay;
        });

        return dynamicStyles;
    }

    /**
        * Get the css for html template, including all its rows
        * @param {number} time - time for calculations based on keyframes
        * @returns {string} The css of the element
    */
    getStyles(time) {
        return `
            ${super.getStyles({
                time: time,
                additionalStyles: `
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    height:100%;
                `})
            }
            ${this.#rows.map(eventRow => eventRow.getStyles(time)).join('')}
        `
    }

    /**
        * Get the parts html code, including all its rows
        * @returns {string} The html code to be used in video generator template
    */
    getHtml() {
        return `<div id="${super.getId()}">${this.#rows.map(eventRow => eventRow.getHtml()).join('')}</div>`;
    }
}