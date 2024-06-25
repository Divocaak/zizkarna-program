import { MonthlyOverviewEventRow } from "$lib/classes/video/monthlyOverview/eventRow.js";
import { VideoElement } from "../videoElement";

/**
    * Represents a holder for half/all texts in monthly overview
    * with all necessary data to control section times and padding
    * @class
*/
export class MonthlyOverviewPartHolder {
    /**
        * Total height of the texts
        * @type {number}
        * @private
    */
    #height;

    /**
        * Texts to render
        * @type {Array<MonthlyOverviewEventRow>}
        * @private
    */
    #rows;

    /**
        * Bottom padding of texts
        * @type {number}
        * @private
    */
    #bottomPadding;

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
        this.id = id;
        this.#height = 0;
        this.#rows = [];
        this.#bottomPadding = 0;
        this.#inStart = 0;
        this.#outStart = 0;
    }

    /**
        * Adds to height
        * @param {number} valToUpdate - The value to add/subtract to/from height
    */
    updateHeight(valToUpdate) {
        this.#height += valToUpdate;
    }

    /**
        * Calculates the bottom padding based on given usableVerticalSpace
        * @param {number} usableVerticalSpace - usable vertical space for the render
    */
    calculateBottomPadding(usableVerticalSpace) {
        this.#bottomPadding = (usableVerticalSpace - this.#height) / this.#rows.length;
    }

    /**
        * Pushes to rows
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
        * returns array of ready to use video elements for all events in part
        * @returns {Array<VideoElement>} the time when fade out starts
    */
    getAllVideoElements({
        eventFadeInDelay = 0,
        eventFadeOutDelay = 0
    }) {
        let currentRowFadeInStart = this.#inStart;
        let currentRowFadeOutStart = this.#outStart;

        let currentRowYPosition = 0;
        /* NOTE do i need this var?? */
        //const xPosition = 50 * dimensionScaleFactor.w;

        /* const lineStartX = w / 2; */
        const toRet = [];
        /* TODO return immediately */
        this.#rows.forEach(eventRow => {

            /* const lineY = currentRowYPosition - (40 * dimensionScaleFactor.h);
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
            ], time, "easeInOutQuint"); */

            toRet.push(...eventRow.getVideoElements({
                id: this.id,
                currentYPosition: currentRowYPosition,
                timeInStart: currentRowFadeInStart,
                timeOutStart: currentRowFadeOutStart,
                bottomPadding: this.#bottomPadding
            }));

            //currentRowYPosition += 0; // rowsPadding; // eventBottomPadding + eventRow.height;
            currentRowFadeInStart += eventFadeInDelay;
            currentRowFadeOutStart += eventFadeOutDelay;
        });

        return toRet;
    }
}