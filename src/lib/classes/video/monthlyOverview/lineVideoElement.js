import { VideoElement } from "$lib/classes/video/videoElement.js"

/**
    * Represents a video element of line used in overviews
    * @class
*/
export class LineVideoElement extends VideoElement {
    /**
        * Create a line video element.
        * @param {string} id - identificator of the object (for linking style and DOM)
        * @param {number | Array<*>} posX - X position of element, array for keyframe interpolation or static number
        * @param {number | Array<*>} width - width of line in %, array for keyframe interpolation or static number
        * @param {number} height - height of line in pixels
        * @param {string} color - text color in hex (including #) for css
    */
    constructor({
        id,
        posX,
        width,
        height,
        color,
    }) {
        super({
            id: id,
            posX: posX,
            easing: "inOutQuint"
        });
        this.color = color;
        this.width = width;
        this.height = height;
    }

    /**
        * Get the css for html template
        * @param {number} time - time for calculations based on keyframes
        * @returns {string} The css of the element
    */
    getStyles(time) {
        return super.getStyles({
            time: time,
            additionalStyles: `
                background-color: ${this.color};
                width: ${super.getWidthInTime(time, this.width)}%;
                height: ${this.height}px;
                position: relative;
            `
        });
    }

    /**
        * Get the elements html code
        * @returns {string} The html code to be used in video generator template
    */
    getHtml() {
        return `<div id="${super.getId()}"></div>`;
    }
}