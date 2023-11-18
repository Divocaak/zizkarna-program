import { ADMIN_PASSWORD } from "$env/static/private";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";

    // TODO predelat na na novej vyklikavaci system asi??
    /* let bandsData = formData.bands != "" ? formData.bands.split(".").map(Number) : [];
    let tagsData = formData.tags != "" ? formData.tags.split(".").map(Number) : []; */

    const response = await event.fetch('/api/admin/events/update', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(formData)
      /* body: JSON.stringify({ id: parseInt(formData.id), bands: bandsData, tags: tagsData }) */
    });
    const result = await response.json();
    return result.message;
  }
};

export const load = async ({ params, fetch }) => {
  // NOTE mby dont use?
  const bandsResult = await fetch("/api/admin/bands/list");
  const bandsData = await bandsResult.json();
  
  // NOTE mby dont use?
  const tagsResult = await fetch("/api/admin/tags/list");
  const tagsData = await tagsResult.json();

  const eventResult = await fetch("/api/admin/events/get?id=" + params.id);
  const eventData = await eventResult.json();
  
  return { event: eventData, bands: bandsData, tags: tagsData};
}