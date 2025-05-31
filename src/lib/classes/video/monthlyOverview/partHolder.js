import { MonthlyOverviewEventRow } from '$lib/classes/video/monthlyOverview/eventRow.js';
import { VideoElement } from '$lib/classes/video/videoElement';
import { RowDynamicStyles } from '$lib/classes/video/monthlyOverview/dynamicStyles/rowDynamicStyles';

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
	 * DynamicStyles holder for this part
	 * @type {RowDynamicStyles}
	 * @private
	 */
	#dynamicStyles;

	/**
	 * is this part the second part
	 * @type {boolean}
	 * @private
	 */
	#isSecondPart;

	/**
	 * Create a texts holder
	 * variables are meant to be assigned only through set methods
	 * @param {string} id - id of part holder to distinguish parts from each other
	 * @param {{w: number, h: number}} usableSpace - computed usableSpace for this part, width and height
	 * @param {number} rowsCount - sum of rows count for this part
	 * @param {boolean} isSecondPart - is this part the second part (default false)
	 */
	constructor({ id, usableSpace, rowsCount, isSecondPart = false }) {
		super({ id });
		this.#rows = [];
		this.#inStart = 0;
		this.#outStart = 0;
		this.#isSecondPart = isSecondPart;

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
	 * Pushes new row to rows.
	 * Calculates the padding and font sizes for dates and labels and top lines line width.
	 * If this is the second part, only push newRow to rows and return, as the dynamic styles are inherited from first part (skip calculations)
	 * @param {MonthlyOverviewEventRow} newRow - row to be pushed
	 * @param {boolean} isLast - is this row the last one, if so, finalize dynamic style properties
	 */
	pushRow({ newRow, isLast }) {
		if (this.#isSecondPart) {
			this.#rows.push(newRow);
			return;
		}

		this.#dynamicStyles.calculateRowHeight({ date: newRow.dateText, label: newRow.label });
		this.#rows.push(newRow);

		if (isLast) this.#dynamicStyles.finalizeProperties();
	}

	/**
	 * Creates the VideoObjects for all rows in this part
	 * Returns DynamicStyles used for this part to be reused in another part
	 * @param {number} eventFadeInDelay - i + 1 row fade in delay according to row i
	 * @param {number} eventFadeOutDelay - i + 1 row fade out delay according to row i
	 * @param {RowDynamicStyles} dynamicStyles - DynamicStyles to use for this part (use this parameter in second part)
	 * @param {number} outputWidth - canvases width
	 * @returns {RowDynamicStyles} DynamicStyles used for this part
	 */
	createPartVideoObjects({
		eventFadeInDelay = 0,
		eventFadeOutDelay = 0,
		dynamicStyles = this.#dynamicStyles,
		outputWidth
	}) {
		let currentRowFadeInStart = this.#inStart;
		let currentRowFadeOutStart = this.#outStart;

		this.#rows.forEach((eventRow) => {
			eventRow.createVideoObjects({
				parentId: this.id,
				timeInStart: currentRowFadeInStart,
				timeOutStart: currentRowFadeOutStart,
				dynamicStyles: dynamicStyles,
				outputWidth: outputWidth
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
                `
						})}
            ${this.#rows.map((eventRow) => eventRow.getStyles(time)).join('')}
        `;
	}

	/**
	 * Get the parts html code, including all its rows
	 * @returns {string} The html code to be used in video generator template
	 */
	getHtml() {
		return `<div id="${super.getId()}">${this.#rows.map((eventRow) => eventRow.getHtml()).join('')}</div>`;
	}
}
