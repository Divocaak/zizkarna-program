/**
    * Represents a holder for single event, date + presale and line
    * with all necessary data to create video elements
    * @class
*/
export class MonthlyOverviewEventText {
    /**
        * represents line, text and date times
        * @type {any}
        * @private
    */
    #times;

    /**
        * Create a texts holder
        * @param {string} label - label of the event
        * @param {Date} date - date of the event
        * @param {string?} tickets - tickets address
    */
    constructor({
        label,
        date,
        tickets = null
    }) {
        this.label = label;
        this.date = new Date(date);
        this.tickets = tickets
        // calc if needed, otherwise delete
        /* this.#height = 0; */
        /* const height = (dateWrapped.length * dateLineHeight) + (labelWrapped.length * labelLineHeight); */
    }

    /* NOTE wont need */
    /**
     * returns bool if date is past according to todays date
     * @returns {boolean} - past or future
    */
    #isPast() {
        return this.date < new Date();
    }

    /* NOTE wont need */
    /**
        * returns localised (printable) format of events date
        * @returns {string} - localised format of events date
    */
    #getDateLocalised() {
        return this.date.toLocaleDateString('cs-CZ', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'long'
        });
    }

    /* NOTE parameters upon usage: currentTextFadeInStart, currentTextFadeOutStart */
    /**
        * Calculates the fade in and out, start and end times for label, date and line
        * @param {number} inputInStart - current inputIn (relative to last row)
        * @param {number} inputOutStart - current inputOut (relative to last row)
    */
    calculateTimes(inputInStart, inputOutStart) {
        const dateDelay = .1;
        const animationLength = 1;
        const lineDelay = .35;
        const lineAnimationLength = .4;

        const createTimes = (inStart, outStart, delay, length) => ({
            inStart: inStart + delay,
            inEnd: inStart + delay + length,
            outStart: outStart + delay,
            outEnd: outStart + delay + length,
        });

        this.#times = {
            text: createTimes(inputInStart, inputOutStart, 0, animationLength),
            date: createTimes(inputInStart, inputOutStart, dateDelay, animationLength),
            line: createTimes(inputInStart, inputOutStart, lineDelay, lineAnimationLength),
        };
    }
}
