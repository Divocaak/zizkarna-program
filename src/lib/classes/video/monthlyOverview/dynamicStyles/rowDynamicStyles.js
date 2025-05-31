import { LineDynamicStyles } from '$lib/classes/video/monthlyOverview/dynamicStyles/lineDynamicStyles';
import { TextDynamicStyles } from '$lib/classes/video/monthlyOverview/dynamicStyles/textDynamicStyles';

/**
 * Represents a dynamic styles holder for monthly overviews rows elements
 * @class
 */
export class RowDynamicStyles {
	/**
	 * max padding for text elements
	 * @type {number}
	 * @private
	 */
	#maxPadding;

	/**
	 * computed available space per element, how much space can one element take
	 * @type {number}
	 * @private
	 */
	#availableHeightPerElement;

	/**
	 * usable space for elements
	 * @type {{h: number, w: number}}
	 * @private
	 */
	#usableSpace;

	/**
	 * ratios to be used when computing date styles in relation with label styles
	 * @type {{dateFontSize: number, datePadding: number, lineHeight: number}}
	 * @private
	 */
	#ratios;

	/**
	 * line dynamic styles object for top line object
	 * @type {LineDynamicStyles}
	 * @private
	 */
	#line;

	/**
	 * text dynamic styles object for date
	 * @type {TextDynamicStyles}
	 * @private
	 */
	#date;

	/**
	 * text dynamic styles object for label
	 * @type {TextDynamicStyles}
	 * @private
	 */
	#label;

	/**
	 * Create a row dynamic styles holder element
	 * @param {{h: number, w: number}} usableSpace - already computed usableSpace for elements to use
	 * @param {number} rowsCount - total rows count for this specific part
	 */
	constructor({ usableSpace, rowsCount }) {
		const minPadding = 10;
		this.#maxPadding = 200;
		this.#availableHeightPerElement = usableSpace.h / rowsCount;
		this.#usableSpace = usableSpace;
		this.#ratios = { dateFontSize: 0.7, datePadding: 0.5, lineHeight: 1.2 };

		this.#line = new LineDynamicStyles();
		this.#label = new TextDynamicStyles({
			maxHeight: 0,
			fontSize: this.#availableHeightPerElement / (1 + this.#ratios.lineHeight),
			padding: Math.max(
				minPadding,
				Math.min(this.#availableHeightPerElement * 0.1, this.#maxPadding)
			)
		});
		this.#date = new TextDynamicStyles({
			maxHeight: 0,
			fontSize: this.#label.fontSize * this.#ratios.dateFontSize,
			padding: this.#label.padding * this.#ratios.datePadding
		});
	}

	/**
	 * returns TextDynamicStyles object based on selector (date or label)
	 * @param {string} selector - selector, values "date" or "label"
	 * @returns {TextDynamicStyles} - selected object
	 */
	#getTextStyle(selector) {
		if (selector === 'label') return this.#label;
		else if (selector === 'date') return this.#date;
		else return null;
	}

	/**
	 * Calculates rows total height
	 * and saves the value to corresponding TextDynamicStyles objects
	 * @param {string} date - date text content
	 */
	calculateRowHeight({ date, label }) {
		this.#date.calculateElementHeight({
			content: date,
			containerWidth: this.#usableSpace.w,
			lineHeightRatio: this.#ratios.lineHeight
		});
		this.#label.calculateElementHeight({
			content: label,
			containerWidth: this.#usableSpace.w,
			lineHeightRatio: this.#ratios.lineHeight
		});
	}

	/**
	 * finishes computations of all properties
	 * assuming all values are assinged and set
	 */
	finalizeProperties() {
		const maxHeight = Math.max(this.#date.getMaxHeight(), this.#label.getMaxHeight());
		const scaleRatio =
			maxHeight > this.#availableHeightPerElement ? this.#availableHeightPerElement / maxHeight : 1;

		this.#date.finalizeProperties({ scaleRatio: scaleRatio, maxPadding: this.#maxPadding });
		this.#label.finalizeProperties({ scaleRatio: scaleRatio, maxPadding: this.#maxPadding });
		this.#line.finalizeProperties(scaleRatio);
	}

	/**
	 * Get the padding of selected text element
	 * @param {string} selector - selector, values "date" or "label"
	 * @returns {number} computed padding in px
	 */
	getPadding(selector) {
		return this.#getTextStyle(selector).padding;
	}

	/**
	 * Get the font size of selected text element
	 * @param {string} selector - selector, values "date" or "label"
	 * @returns {number} computed font size in px
	 */
	getFontSize(selector) {
		return this.#getTextStyle(selector).fontSize;
	}

	/**
	 * Get the line width for the top line
	 * @returns {number} The line width in pixels
	 */
	getTopLineLineWidth() {
		return this.#line.getLineWidth();
	}

	/**
	 * Get usableSpace for elements
	 * @returns {{h: number, w: number}} usable spaces for elements
	 */
	getUsableSpace() {
		return this.#usableSpace;
	}
}
