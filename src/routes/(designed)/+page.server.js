export const load = async ({ params, fetch }) => {

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