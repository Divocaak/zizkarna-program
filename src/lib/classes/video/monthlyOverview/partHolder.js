import { MonthlyOverviewEventRow } from "$lib/classes/video/monthlyOverview/eventRow.js";
/* TODO imports */
import { VideoElement } from "../videoElement";
import { RowDynamicStyles } from "./dynamicStyles/rowDynamicStyles";
import { TextDynamicStyles } from "./dynamicStyles/textDynamicStyles";

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

    /* DOC */
    #dynamicStyles

    /**
        * Create a texts holder
        * variables are meant to be assigned only through set methods
        * @param {string} id - id of part holder to distinguish parts from each other
    */
    /* DOC */
    /* TODO get rows count in foreach method when pushing new row content */
    constructor({ id, usableSpace, rowsCount }) {
        super({ id });
        this.#rows = [];
        this.#inStart = 0;
        this.#outStart = 0;

        this.#dynamicStyles = new RowDynamicStyles({
            usableSpace: usableSpace,
            rowsCount: rowsCount
        });
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
        * Pushes new row to rows
        * Calculates the padding and font sizes for dates and labels and top lines line width
        * @param {Array<*>} usableSpace - usable space for the texts
        * @param {MonthlyOverviewEventRow} newRow - row to be pushed
    */
    /* DOC */
    pushRow({ newRow, isSecondPart, isLast }) {
        // second part will inherit dynamic styles from first part
        if(isSecondPart){
            this.#rows.push(newRow);
            return;
        }

        const values = newRow.calculateRowHeight({
            labelDynamicStyles: this.#dynamicStyles.getTextStyle("label"),
            dateDynamicStyles: this.#dynamicStyles.getTextStyle("date"),
            usableWidth: this.usableSpace.w,
            lineHeight: ratios.lineHeight
        });
        this.#dynamicStyles.updateToGreaterHeight("date", values.dateHeight)
        this.#dynamicStyles.updateToGreaterHeight("label", values.labelHeight)
        
        this.#rows.push(newRow);
        
        if (isLast) this.#dynamicStyles.finalizeProperties();
    }

    /** 
        * returns array of ready to use video elements for all events in part
        * @param {Array<*>} usableSpace - usable space for the texts
        * @returns {Array<VideoElement>} the time when fade out starts
    */
    /* DOC */
    createPartVideoObjects({
        eventFadeInDelay = 0,
        eventFadeOutDelay = 0,
        dynamicStyles = this.#dynamicStyles
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
        `;
    }

    /**
        * Get the parts html code, including all its rows
        * @returns {string} The html code to be used in video generator template
    */
    getHtml() {
        return `<div id="${super.getId()}">${this.#rows.map(eventRow => eventRow.getHtml()).join('')}</div>`;
    }
}