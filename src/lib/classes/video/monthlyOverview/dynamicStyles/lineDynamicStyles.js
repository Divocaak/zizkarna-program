/**
    * Represents a dynamic styles holder for top line element
    * @class
*/
export class LineDynamicStyles {
    /**
        * final computed line width
        * @type {number}
        * @private
    */
    #lineWidth

    /**
        * default line width
        * @type {number}
        * @private
    */
    #defaultLineWidth

    /**
        * min line width
        * @type {number}
        * @private
    */
    #minLineWidth

    /**
        * max line width
        * @type {number}
        * @private
    */
    #maxLineWidth

    /**
        * Create a top line dynamic styles element
    */
    constructor() {
        this.#defaultLineWidth = 5;
        this.#minLineWidth = 3;
        this.#maxLineWidth = 10;
    }

    /**
        * Finishes calculations of the line width based on default value and limits
        * @param {number} scaleRatio - computed scale ratio for line width
    */
    finalizeProperties(scaleRatio) {
        this.#lineWidth = Math.max(
            this.#minLineWidth,
            Math.min(this.#maxLineWidth, (this.#defaultLineWidth * scaleRatio))
        );
    }

    /**
        * Get the line width for the top line
        * @returns {number} The line width in pixels
    */
    getLineWidth() {
        return this.#lineWidth;
    }
}