import { getEventDetailed } from '$lib/apiShortcuts/getEventDetailed.js'
import { analyticsStore } from '$lib/stores/analyticsStore.js';

export const load = async ({ url, params, fetch }) => {

    const from = url.searchParams.get("from");
    if (from === "share" || from === "copy") {
        const eventKey = from === "share" ? "zz-page-open-from-share-btn" : "zz-page-open-from-copy-text";
        const new_event = {
            id: 'any-random-id',
            data: { id: params.id },
            event: eventKey,
            type: 'event'
        };
        analyticsStore.update(existing_events => [...existing_events, new_event]);
    }

    return await getEventDetailed({ params, fetch });
}