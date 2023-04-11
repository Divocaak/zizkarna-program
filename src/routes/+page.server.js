export const load = async ({params, fetch}) => {

    const result = await fetch("/api/eventsAll");
    const data = await result.json();

    return {
        events: data
    }
}