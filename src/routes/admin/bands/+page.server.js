export const load = async ({params, fetch}) => {

    const result = await fetch("/api/admin/bands/list");
    const data = await result.json();

    return {
        bands: data
    }
}