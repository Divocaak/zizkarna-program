/**
    * Represents a dynamic styles holder for top line element
    * @class
*/
export class LineDynamicStyles {
    /* DOC */
    #lineWidth
    #minLineWidth
    #maxLineWidth

    /**
        * Create a top line dynamic styles element
    */
    constructor() {
        this.#minLineWidth = 1;
        this.#maxLineWidth = 3;
    }

    /* DOC */
    finalizeProperties(scaleRatio) {
        this.#lineWidth = Math.max(
            this.#minLineWidth,
            Math.min(this.#maxLineWidth, (this.#lineWidth * scaleRatio))
        );
    }
}