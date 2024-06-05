import { VideoElement } from "$lib/classes/video/videoElement.js"

export class ImageVideoElement extends VideoElement {
    constructor({
        content,
        keyframesX = [],
        keyframesY = [],
        wPx = 100,
        hPx = 100
    }) {
        super({
            content: content,
            keyframesX: keyframesX,
            keyframesY: keyframesY
        });
        this.wPx = wPx;
        this.hPx = hPx;
    }

    getWPx() { return this.wPx; }
    getHPx() { return this.hPx; }
}