/**
    * Represents a video element
    * @class
*/
export class VideoElement {
    /**
        * Create a video element.
        * @param {string} id - identificator of the object (for linking style and DOM)
        * @param {string} content - text content, or image in base64
        * @param {number | Array<*>} posX - X position of element | array for keyframe interpolation or static number
        * @param {number | Array<*>} posY - Y position of element |array for keyframe interpolation or static number
        * @param {string} easing - easing type from implemented (inOutBack, inOutQuint)
    */
    constructor({
        id,
        content,
        posX = 0,
        posY = 0,
        easing = null
    }) {
        this.id = id;
        this.content = content;
        this.posX = posX;
        this.posY = posY;
        this.easing = easing
    }

    /**
        * Get the elements content
        * @returns {string} The content of element (text or base64)
    */
    getContent() { return this.content; }

    /**
        * Get the css for html template, allows additional classes as parameter
        * @param {number} time - time for calculations based on keyframes
        * @param {string} additionalStyles - additional styles to add from outside
        * @returns {string} The css of the element
    */
    getStyles({
        time,
        additionalStyles = ""
    }) {
        return `#${this.getId()}{
            position: absolute;
            top: ${this.#getYInTime(time)}px;
            left: ${this.#getXInTime(time)}px;
            padding: 0;
            margin: 0;
            ${additionalStyles}
        }`;
    }

    /**
        * Get the elements id
        * @returns {string} THe id of the element for style and html element linking
    */
    getId(){
        return `generated-${this.id}`;
    }

    #getXInTime(time) { return Array.isArray(this.posX) ? this.#interpolateKeyframes({ keyframes: this.posX, time: time, easing: this.easing }) : this.posX; }

    #getYInTime(time) { return Array.isArray(this.posY) ? this.#interpolateKeyframes({ keyframes: this.posY, time: time, easing: this.easing }) : this.posY; }
    
    getWidthInTime(time, width) { return Array.isArray(this.width) ? this.#interpolateKeyframes({ keyframes: this.width, time: time, easing: this.easing }) : this.width; }

    #interpolateKeyframes({ keyframes = [], time = 0, easing = null }) {

        const firstKeyframe = keyframes[0];
        if (time < firstKeyframe.time) return firstKeyframe.value;

        const lastKeyframe = keyframes[keyframes.length - 1];
        if (time >= lastKeyframe.time) return lastKeyframe.value;

        let index;
        for (index = 0; index < keyframes.length - 1; index++) {
            if (keyframes[index].time <= time && keyframes[index + 1].time >= time) break;
        }

        const keyframe1 = keyframes[index];
        const keyframe2 = keyframes[index + 1];

        let t = (time - keyframe1.time) / (keyframe2.time - keyframe1.time);
        if (easing === "inOutBack") t = this.#easeInOutBack(t);
        else if (easing === "inOutQuint") t = this.#easeInOutQuint(t);

        return keyframe1.value + (keyframe2.value - keyframe1.value) * t;
    }

    #easeInOutBack(x) {
        const c1 = 1.70158 * .75;
        const c2 = c1 * 1.525 * .75;

        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }

    #easeInOutQuint = (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}