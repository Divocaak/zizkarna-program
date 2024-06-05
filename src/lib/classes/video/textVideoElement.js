import { VideoElement } from "$lib/classes/video/videoElement.js"

export class TextVideoElement extends VideoElement {
    constructor({
        content,
        keyframesX = [],
        keyframesY = [],
        fontName = "Arial",
        fontSizePx = 14
    }) {
        super({
            content: content,
            keyframesX: keyframesX,
            keyframesY: keyframesY
        });
        this.fontName = fontName;
        this.fontSizePx = fontSizePx;
    }

    getFontName() { return this.fontName; }
    getFontSizePx() { return this.fontSizePx; }
}