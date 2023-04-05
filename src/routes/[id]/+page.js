import events from '$lib/content/events.json';

export const load = ({ params }) => {
    return {
        event: events[params.id]
    }
}