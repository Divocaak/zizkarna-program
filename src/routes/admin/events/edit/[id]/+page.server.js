import { ADMIN_PASSWORD } from "$env/static/private";

export const load = async ({ params, fetch }) => {
  const bandsResult = await fetch("/api/admin/bands/list");
  const bandsData = await bandsResult.json();
  
  const tagsResult = await fetch("/api/admin/tags/list");
  const tagsData = await tagsResult.json();
  
  return { id: params.id, bands: bandsData, tags: tagsData};
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";

    let bandsData = formData.bands != "" ? formData.bands.split(".").map(Number) : [];
    let tagsData = formData.tags != "" ? formData.tags.split(".").map(Number) : [];

    console.log(bandsData);
    console.log(tagsData);

    const response = await event.fetch('/api/admin/events/edit', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: parseInt(formData.id), bands: bandsData, tags: tagsData })
    });
    const result = await response.json();
    console.log(result.message);
    return result.message;
  }
};