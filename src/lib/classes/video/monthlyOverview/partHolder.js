import { MonthlyOverviewEventRow } from "$lib/classes/video/monthlyOverview/eventRow.js";
import { VideoElement } from "../videoElement";

/**
    * Represents a holder for half/all texts in monthly overview
    * with all necessary data to control section times and padding
    * @class
*/
export class MonthlyOverviewPartHolder {
    /**
        * Total height of all the rows (line, date, label)
        * @type {number}
        * @private
    */
    #rowsHeightSum;

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
        * @param {Array<*>} usableSpace - usable space for the texts
    */
    constructor({ id, usableSpace }) {
        this.id = id;
        this.usableSpace = usableSpace;
        this.#rowsHeightSum = 0;
        this.#rows = [];
        this.#inStart = 0;
        this.#outStart = 0;
    }

    /**
        * Pushes to rows
        * Recalculates the total height of the rows with default font sizes and padding
        * @param {MonthlyOverviewEventRow} newRow - row to be pushed
    */
    pushRow({ newRow, usableWidth = 1080 }) {
        this.#rowsHeightSum += newRow.calculateRowHeight(usableWidth);
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
        return this.#inStart.length;
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
        return this.#outStart.length;
    }

    /**
        * Calculates the bottom padding for rows, multiplier for font sizes and optional top shift of all rows to position list in vertical center
        * @returns {{padding: number, multiplier: number, topShift: number}} already multiplied padding, number to multiply texts and topShift (to center texts vertically)
    */
    #calculatePaddingAndMultiplierAndShift() {
        const minPadding = 10; // minimum padding
        const maxPadding = 100; // maximum padding

        const toRet = { padding: minPadding, multiplier: 1, topShift: 0 };

        /* TODO minus one padding for last this.#rows, which does not need padding, as its already padded by pages padding bottom */
        const minPaddingSpaceNeeded = this.getRowsCount() * minPadding; // total minimum padding needed for all rows
        toRet.multiplier = (minPaddingSpaceNeeded <= (this.usableSpace.h - this.#rowsHeightSum))
            // min space for all paddings smaller then the available space after rows
            ? toRet.multiplier = (this.usableSpace.h - minPaddingSpaceNeeded) / this.#rowsHeightSum // calculate multiplier to scale down texts, so minimum padding fits
            // space left with default font sizes and minimum paddings, calculate multiplier
            : this.usableSpace.h / (this.#rowsHeightSum + minPaddingSpaceNeeded); // space left with default font sizes and minimum paddings, calculate multiplier

        const multipliedPadding = toRet.padding * toRet.multiplier;
        // a lot of free space, large paddings
        // use the freed up space to move content to the center of the y axis
        if (multipliedPadding > maxPadding) {
            toRet.topShift = multipliedPadding - (maxPadding * this.getRowsCount());
        }

        toRet.padding = (multipliedPadding > maxPadding)
            // a lot of free space, large paddings
            ? maxPadding // set to maxPadding, to preserve text readable list
            : multipliedPadding

        console.log(toRet);
        return toRet;
    }

    /** 
        * returns array of ready to use video elements for all events in part
        * @returns {Array<VideoElement>} the time when fade out starts
    */
    getAllVideoElements({
        /* NOTE document parameters */
        eventFadeInDelay = 0,
        eventFadeOutDelay = 0,
    }) {
        let currentRowFadeInStart = this.#inStart;
        let currentRowFadeOutStart = this.#outStart;
        let currentRowYPosition = 0;

        return this.#rows.flatMap(eventRow => {
            const videoElements = eventRow.getVideoElements({
                parentId: this.id,
                currentYPosition: currentRowYPosition,
                timeInStart: currentRowFadeInStart,
                timeOutStart: currentRowFadeOutStart,
                paddingAndMultiplierAndShift: this.#calculatePaddingAndMultiplierAndShift()
            });

            currentRowFadeInStart += eventFadeInDelay;
            currentRowFadeOutStart += eventFadeOutDelay;
            return videoElements
        });
    }
}