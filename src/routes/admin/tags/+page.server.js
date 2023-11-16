export const load = async ({params, fetch}) => {

    const result = await fetch("/api/admin/tags/list");
    const data = await result.json();

    return {tags: data};
}