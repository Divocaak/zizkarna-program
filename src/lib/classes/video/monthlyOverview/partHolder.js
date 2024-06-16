import { MonthlyOverviewEventText } from "$lib/classes/video/monthlyOverview/eventText";
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
        * @param {string} id - id of part holder to distinguish parts from each other
    */
    constructor({id}) {
        this.id = id;
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

    /** 
        * returns array of ready to use video elements for all events in part
        * @returns {Array<VideoElement>} the time when fade out starts
    */
    getAllVideoElements({
        eventFadeInDelay = 0,
        eventFadeOutDelay = 0,
        rowsPadding = 0
    }) {
        let currentTextFadeInStart = this.#inStart;
        let currentTextFadeOutStart = this.#outStart;

        let currentRowYPosition = 0;
        /* NOTE do i need this var?? */
        //const xPosition = 50 * dimensionScaleFactor.w;
        
        /* const lineStartX = w / 2; */
        this.#texts.forEach(eventText => {

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

            eventText.getVideoElements({
                id: this.id,
                currentYPosition: currentRowYPosition,
                scaleFactor: scaleFactor,
                userWantsToDimPast: userWantsToDimPast,
                timeInStart: currentTextFadeInStart,
                timeOutStart: currentTextFadeOutStart,
                isStatic: isStatic
            });

            // BUG custom styles, position relative
            currentRowYPosition += rowsPadding; // eventBottomPadding + eventText.height;
            currentTextFadeInStart += eventFadeInDelay;
            currentTextFadeOutStart += eventFadeOutDelay;
        });
    }
}