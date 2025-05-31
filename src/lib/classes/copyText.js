/**
 * Represents a copyable text
 * @class
 */
export class CopyText {
	/**
	 * Texts to hold
	 * @type {string}
	 * @private
	 */
	#content;

	/**
	 * Create a copy text element
	 * @param {string} content - text content to be able to copy
	 */
	constructor({ content = '' } = {}) {
		this.#content = content;
	}

	/**
	 * Updates the elements content with newVal
	 * @param {string} newVal - new val to store
	 */
	setContent(newVal) {
		this.#content = newVal;
	}

	/**
	 * Returns the elements content as a string
	 * @returns {string} the elements content
	 */
	getContent() {
		return this.#content;
	}

	/**
	 * Returns the elements content as a styled html string
	 * @returns {string} the styled elements html content
	 */
	getContentStyled() {
		return `<p style="white-space: pre-line; background-color: grey; color:black;">${this.#content}</p>`;
	}

	/**
	 * Copies the elemtns content to clipboards
	 * usage: <button on:click={copyTextElement.copyText()}>copy to clipboard</button>
	 */
	copyText() {
		navigator.clipboard.writeText(this.#content);
	}
}
