import { analyticsStore } from '$lib/stores/analyticsStore.js';

export const load = async ({ url, params, fetch }) => {

    const result = await fetch("/api/events/zztv");
    const data = await result.json();

    const new_event = {
        id: 'any-random-id',
        data: {},
        event: "zztv-page-opened",
        type: 'event'
    };
    analyticsStore.update(existing_events => [...existing_events, new_event]);

    return { events: data };
}