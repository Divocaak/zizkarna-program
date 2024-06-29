import fs from 'fs';
import { VideoElement } from "$lib/classes/video/videoElement.js"

/* REFACTOR create gradient object */
/**
    * Represents a video element of type image
    * @class
*/
export class ImageVideoElement extends VideoElement {
    /**
        * Create a image video element.
        * @param {string} id - identificator of the object (for linking style and DOM)
        * @param {string} content - image in base64 (insert path to image, conversion to base64 is applied in constructor)
        * @param {number | Array<*>} posX - X position of element, array for keyframe interpolation or static number
        * @param {number | Array<*>} posY - Y position of element, array for keyframe interpolation or static number
        * @param {number} wPx - width in px for css (used only for gradients)
        * @param {number} hPx - height in px for css (used only for gradients)
        * @param {string} easing - easing type from implemented (inOutBack, inOutQuint)
    */
    constructor({
        id,
        content,
        posX = 0,
        posY = 0,
        wPx = null,
        hPx = null,
        easing = null
    }) {
        super({
            id: id,
            content: ImageVideoElement.getPngBase64(content),
            posX: posX,
            posY: posY,
            easing: easing
        });
        this.wPx = wPx;
        this.hPx = hPx;
    }

    /**
        * Get the css for html template for user selected image
        * @param {number} time - time for calculations based on keyframes
        * @returns {string} The css of the element
    */
    getStyles(time) {
        return super.getStyles({
            time: time,
            additionalStyles: `
                background-image: url('${super.getContent()}');
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                border: 1px solid cyan;
                ${this.#getWPx() != null && this.#getHPx() != null
                    ? `width: ${this.#getWPx()}px; height: ${this.#getHPx()}px;`
                    : `min-width: 100%; aspect-ratio: 16/9;`} 
            `
        });
    }

    /**
        * Get the css for html template for gradients
        * @param {number} time - time for calculations based on keyframes
        * @returns {string} The css of the element
    */
    getGradientStyles(time) {
        return super.getStyles({
            time: time,
            additionalStyles: `
                width: ${this.#getWPx()}px;
                height: ${this.#getHPx()}px;
                background-image: url('${super.getContent()}');
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                border: 1px solid cyan;
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

    #getWPx() { return this.wPx; }

    #getHPx() { return this.hPx; }

    /**
        * Get base64 of input image
        * @param {string} pathToImg - path to image to convert
        * @returns {string} base64 string of input image
    */
    static getPngBase64(pathToImg) {
        const image = fs.readFileSync(pathToImg);
        const base64Image = new Buffer.from(image).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    }

    /**
        * Get random position in some range, make sure that always at least half of the image is visible
        * @param {number} imgW - source images w
        * @param {number} imgH - source images h
        * @param {number} maxW - max h
        * @param {number} maxH - max h
        * @returns {{x: number, y: number}} An object containing the x and y coordinates.
    */
    static getImagePositionInRange(imgW, imgH, maxW, maxH) {
        const minX = -imgW / 2;
        const maxX = maxW - imgW / 2;
        const x = Math.random() * (maxX - minX) + minX;

        const minY = -imgH / 2;
        const maxY = maxH - imgH / 2;
        const y = Math.random() * (maxY - minY) + minY;

        return { x, y };
    }
}