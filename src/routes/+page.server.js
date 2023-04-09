export const load = async ({params, fetch}) => {

    const result = await fetch("/api/event");
    const data = await result.json();

    return {
        events: data
    }
}