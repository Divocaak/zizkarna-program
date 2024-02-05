import { analyticsStore } from '$lib/stores/analyticsStore.js';

export const load = async ({ url, params, fetch }) => {

    const from = url.searchParams.get("from");
    if (from != null && from == "qr") {
        const new_event = {
            id: 'any-random-id',
            data: {},
            event: "zz-page-open-from-qr",
            type: 'event'
        };
        analyticsStore.update((existing_events) => [...existing_events, new_event]);
    }

    const result = await fetch("/api/events/list");
    const data = await result.json();

    const today = new Date();

    const { past, close, future } = data.reduce(
        (result, event) => {
            const eventDate = new Date(event.date);
            eventDate.setDate(new Date(event.date).getDate() + 1);

            if (eventDate < today) {
                result.past.unshift(event);
            } else if (result.close.length < 3) {
                result.close.push(event);
            } else {
                result.future.push(event);
            }

            return result;
        },
        { past: [], close: [], future: [] }
    );

    return {
        closest: close,
        future: future,
        older: past
    }
}