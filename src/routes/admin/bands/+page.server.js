export const load = async ({params, fetch}) => {

    const result = await fetch("/api/bands/list");
    const data = await result.json();

    return {
        bands: data
    }
}