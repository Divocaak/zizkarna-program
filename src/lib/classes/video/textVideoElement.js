import { VideoElement } from "$lib/classes/video/videoElement.js"

/**
    * Represents a video element of type text
    * @class
*/
export class TextVideoElement extends VideoElement {
    /**
        * Create a text video element.
        * @param {string} id - identificator of the object (for linking style and DOM)
        * @param {string} content - text content
        * @param {number | Array<*>} posX - X position of element, array for keyframe interpolation or static number
        * @param {number | Array<*>} posY - Y position of element, array for keyframe interpolation or static number
        * @param {string} fontName - font name for css
        * @param {number} fontSizePx - font size in px for css
        * @param {string} fontColor - text color in hex (including #) for css
        * @param {string} textAlign - text align for css
        * @param {string} easing - easing type from implemented (inOutBack, inOutQuint)
    */
    constructor({
        id,
        content,
        posX = 0,
        posY = 0,
        fontName = "Arial",
        fontSizePx = 14,
        fontColor = "#d4d4d4",
        textAlign = "left",
        easing = null
    }) {
        super({
            id: id,
            content: content,
            posX: posX,
            posY: posY,
            easing: easing
        });
        this.fontName = fontName;
        this.fontSizePx = fontSizePx;
        this.fontColor = fontColor;
        this.textAlign = textAlign;
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
                font-size: ${this.#getFontSizePx()}px;
                font-family: ${this.#getFontName()}, sans-serif;
                color: ${this.#getFontColor()};
                text-align: ${this.#getTextAlign()};
                border: 1px solid purple;
            `
        });
    }

    /**
        * Get the elements html code
        * @returns {string} The html code to be used in video generator template
    */
    getHtml() {
        return `<p id="${super.getId()}">${super.getContent()}</p>`;
    }

    #getFontName() { return this.fontName; }

    #getFontSizePx() { return this.fontSizePx; }

    #getFontColor() { return this.fontColor; }

    #getTextAlign() { return this.textAlign; }
}

// NOTE saved line lengths and amx len and img dimensions
// const eventLabelWrapped = getWrappedText(data.eventLabel, 130, context, 80);
// const eventTagsWrapped = getWrappedText(data.eventTags, 200, context, 50);
// const posterDimensions = getImgDimensions(poster, "contain", 1080, 1500);

// const bandLabelWrapped = getWrappedText(data.bandLabel, 120, context, 70);
// const bandDescWrapped = getWrappedText(data.bandDesc, 250, context, 50);
// const bandTagsWrapped = getWrappedText(data.bandTags, 200, context, 50);
// const bandStageTimeWrapped = getWrappedText(data.bandStageTime, 300, context, 40);
// const bandImageDimensions = getImgDimensions(bandImage, "contain", 1080, 1500);

// const dateWrapped = getWrappedText(data.date, 500, context, 90);
// const doorsWrapped = getWrappedText(data.doors, 500, context, 90);
// const ticketsWrapped = data.tickets ? getWrappedText(data.tickets, 100, context, 90) : null;
// const logo = await loadImage("./vidGenAssets/logo_transparent.png");