import { MonthlyOverviewEventText } from "$lib/classes/video/monthlyOverview/eventText";

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
        * @type {Array<MonthlyOverviewEventText>}
        * @private
    */
    #texts;

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
    */
    constructor() {
        this.#height = 0;
        this.#texts = [];
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
        this.#bottomPadding = (usableVerticalSpace - this.#height) / this.#texts.length;
    }

    /**
        * Pushes to texts
        * @param {MonthlyOverviewEventText} newText - text to be pushed
    */
    pushText(newText) {
        this.#texts.push(newText);
    }

    /**
        * returns texts count
        * @returns {number} the count of the texts
    */
    getTextsCount() {
        return this.#texts.length;
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

    /* TODO add id prefix for parts */
}