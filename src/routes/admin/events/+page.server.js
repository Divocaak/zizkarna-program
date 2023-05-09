export const load = async ({params, fetch}) => {

    const result = await fetch("/api/admin/events/list");
    const data = await result.json();

    return {
        events: data
    }
}