import { writable, derived } from "svelte/store";
import selectedEvent from './eventStore.js';
import selectedBand from './bandStore.js';

const videoStore = writable({
    selectedEvent,
    selectedBand
});

// Derived store to get data from store1
export const selectedEventData = derived(videoStore, ($videoStore) => $videoStore.selectedEvent);

// Derived store to get data from store2
export const selectedBandData = derived(videoStore, ($videoStore) => $videoStore.selectedBand);

// Actions to set values in individual stores
export const setEvent = (newValue) => {
  videoStore.update(state => {
    state.selectedEvent = newValue;
    return state;
  });
};

export const setBand = (newValue) => {
  videoStore.update(state => {
    state.selectedBand = newValue;
    return state;
  });
};

export default videoStore;