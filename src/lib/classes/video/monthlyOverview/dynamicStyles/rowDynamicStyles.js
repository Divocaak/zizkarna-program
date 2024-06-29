import { LineDynamicStyles } from "./lineDynamicStyles";
import { TextDynamicStyles } from "./textDynamicStyles";
/* TODO imports */

/**
    * Represents a dynamic styles holder for monthly overviews rows elements
    * @class
*/
export class RowDynamicStyles {
    /* DOC */
    #line
    #date
    #label

    #maxPadding
    #availableHeightPerElement
    /**
        * Create a row dynamic styles holder element
        * @param {LineDynamicStyles} line - top line dynamic styles
        * @param {TextDynamicStyles} date - date dynamic styles
        * @param {TextDynamicStyles} label - label dynamic styles
    */
    constructor({
        usableSpace,
        rowsCount
    }) {
        this.#line = new LineDynamicStyles();

        const ratios = { dateFontSize: .7, datePadding: 0.5, lineHeight: 1.2 };
        const minPadding = 10;
        this.#maxPadding = 200;
        this.#availableHeightPerElement = usableSpace.h / rowsCount;

        this.#label = new TextDynamicStyles({
            maxHeight: 0,
            fontSize: availableHeightPerElement / (1 + ratios.lineHeight),
            padding: Math.max(minPadding, Math.min(availableHeightPerElement * 0.1, maxPadding))
        })

        this.#date = new TextDynamicStyles({
            maxHeight: 0,
            fontSize: this.#label.fontSize * ratios.dateFontSize,
            padding: this.#label.padding * ratios.datePadding
        })
    }

    /* DOC */
    getTextStyle(selector) {
        if (selector === "label")
            return this.#line;
        else if (selector === "date")
            return this.#date;
        else
            return null;
    }

    /* DOC */
    updateToGreaterHeight({ selector, newVal }) {
        this.getTextStyle(selector).updateToGreaterHeight(newVal);
    }

    /* DOC */
    finalizeProperties() {
        const maxHeight = Math.max(this.#date.getMaxHeight(), this.#label.getMaxHeight());
        const scaleRatio = maxHeight > this.#availableHeightPerElement
            ? this.#availableHeightPerElement / maxHeight
            : 1;

        this.#date.finalizeProperties({ scaleRatio: scaleRatio, maxPadding: this.#maxPadding });
        this.#label.finalizeProperties({ scaleRatio: scaleRatio, maxPadding: this.#maxPadding });
        this.#line.finalizeProperties(scaleRatio);
    }
}