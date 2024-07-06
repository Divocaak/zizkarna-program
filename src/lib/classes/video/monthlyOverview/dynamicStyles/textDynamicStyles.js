/**
    * Represents a dynamic styles holder for text element
    * @class
*/
export class TextDynamicStyles {
    /**
        * greatest calculated maxHeight of text element
        * @type {number}
        * @private
    */
    #maxHeight
    
    /**
        * Create a text dynamic styles element
        * @param {number} fontSize - current calculated fontSize of text element
        * @param {number} padding - current calculated bottom padding of text element
    */
    constructor({
        fontSize,
        padding
    }) {
        this.#maxHeight = 0;
        this.fontSize = fontSize;
        this.padding = padding;
    }

    /**
        * Get the greatest max height of all text elements
        * @returns {number} greatest found height
    */
    getMaxHeight() {
        return this.#maxHeight;
    }

    /**
        * Calculates elements height
        * If computed value is greater than current found maxHeight, updates the value
        * @param {string} content - text to compute
        * @param {number} containerWidth - width to fit object into
        * @param {number} lineHeightRatio - line height ratio
    */
    calculateElementHeight({content, containerWidth, lineHeightRatio}) {
        const lines = Math.ceil(content.length / (containerWidth / (this.fontSize / 2)));
        const computedValue = lines * this.fontSize * lineHeightRatio + this.padding;
        this.#maxHeight = Math.max(this.#maxHeight, computedValue)
    }

    /**
        * Finishes calculations of the font size and padding
        * Assuming all values have been set and updated
        * @param {number} scaleRatio - computed scale ratio for line width
        * @param {number} maxPadding - maximal limit for padding
    */
    finalizeProperties({scaleRatio, maxPadding }) {
        this.fontSize *= scaleRatio;
        this.padding = Math.min(this.padding/*  * scaleRatio */, maxPadding);
    }
}