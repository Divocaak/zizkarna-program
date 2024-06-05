import { interpolateKeyframes } from "$lib/scripts/video/helperFunctions.js";

export class VideoElement {
    constructor({
        content,
        keyframesX = [],
        keyframesY = []
    }) {
        this.content = content;
        this.keyframesX = keyframesX;
        this.keyframesY = keyframesY;
    }

    getContent() { return this.content; }

    getXInTime({ time, easing = null }) { return interpolateKeyframes({ keyframes: this.keyframesX, time: time, easing: easing }); }
    getYInTime({ time, easing = null }) { return interpolateKeyframes({ keyframes: this.keyframesY, time: time, easing: easing }); }
}