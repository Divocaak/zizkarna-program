/**
    * Represents a dynamic styles holder for text element
    * @class
*/
export class TextDynamicStyles {
    /* DOC */
    #maxHeight
    /**
        * Create a text dynamic styles element
        * @param {number} maxHeight - greatest calculated maxHeight of text element
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

    /* DOC */
    getMaxHeight() {
        return this.#maxHeight;
    }

    /* DOC */
    updateToGreaterHeight(newVal) {
        this.#maxHeight = Math.max(this.#maxHeight, newVal);
    }

    /* DOC */
    finalizeProperties({scaleRatio, maxPadding }) {
        this.fontSize *= scaleRatio;
        this.padding = Math.min(this.padding/*  * scaleRatio */, maxPadding);
    }
}