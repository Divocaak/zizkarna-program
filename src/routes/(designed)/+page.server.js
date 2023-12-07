export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/eventsAll");
    const data = await result.json();

    const today = new Date();

    const { past, close, future } = data.reduce(
        (result, event) => {
            const eventDate = new Date(event.date);

            if (eventDate < today) {
                console.log("past: " + event.label);
                result.past.unshift(event);
            } else if (result.close.length < 3) {
                console.log("close: " + event.label);
                result.close.push(event);
            } else {
                console.log("future: " + event.label);
                result.future.push(event);
            }

            return result;
        },
        { past: [], close: [], future: [] }
    );

    console.log("---");
    console.log("all: " + data.length);
    console.log("future: " + future.length);
    console.log("past: " + past.length);
    console.log("close: " + close.length);
    console.log("---");

    return {
        closest: close,
        future: future,
        older: past
    }
}