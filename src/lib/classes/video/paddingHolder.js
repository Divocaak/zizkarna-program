/**
    * Represents a padding element
    * @class
*/
export class PaddingElement {
    /**
        * Create a padding element
        * @param {number | {top: number, bottom: number}} y - padding for y axis or object with given padding for top and bottom. in pixels
        * @param {number | {left: number, right: number}} x - padding for x axis or object with given padding for left and right. in pixels
    */
    constructor({ y, x }) { this.y = y; this.x = x; }

    /**
        * Return the top padding
        * @returns {number} top padding in pixels
    */
    getTop() { return typeof this.y === 'number' ? this.y : this.y.top; }

    /**
        * Return the bottom padding
        * @returns {number} bottom padding in pixels
    */
    getBottom() { return typeof this.y === 'number' ? this.y : this.y.bottom; }

    /**
        * Return the total y padding, 2 * y for top and bottom or sum of top and bottom
        * @returns {number} total y padding in pixels
    */
    getY() { return typeof this.y === 'number' ? (2 * this.y) : (this.y.top + this.y.bottom); }

    /**
         * Return the left padding
         * @returns {number} left padding in pixels
     */
    getLeft() { return typeof this.x === 'number' ? this.x : this.x.left; }

    /**
        * Return the right padding
        * @returns {number} right padding in pixels
    */
    getRight() { return typeof this.x === 'number' ? this.x : this.x.right; }

    /**
        * Return the total x padding, 2 * x for left and right or sum of left and right
        * @returns {number} total x padding in pixels
    */
    getX() { return typeof this.x === 'number' ? (2 * this.x) : (this.x.left + this.x.right); }
}