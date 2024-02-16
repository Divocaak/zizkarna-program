import { writable } from "svelte/store";

const selectedEvent = writable();
const selectedBand = writable();

export default {selectedEvent, selectedBand};