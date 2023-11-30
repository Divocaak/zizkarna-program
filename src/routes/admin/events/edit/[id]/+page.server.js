import { ADMIN_PASSWORD } from "$env/static/private";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";

    // TODO EVENT predelat na na novej vyklikavaci system asi??
    /* let bandsData = formData.bands != "" ? formData.bands.split(".").map(Number) : [];
    let tagsData = formData.tags != "" ? formData.tags.split(".").map(Number) : []; */

    const response = await event.fetch('/api/admin/events/update', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        label: formData.label,
        date: formData.date,
        doors: formData.doors,
        cash: formData.cash,
        fbEvent: formData.fbEvent != "" ? formData.fbEvent : null,
        tickets: formData.tickets != "" ? formData.tickets : null,
        description: formData.description != null ? formData.description : null,
        is_visible: formData.is_visible == "on",
        id: formData.id
      })
    });
    const result = await response.json();
    return result.message;
  }
};

export const load = async ({ params, fetch }) => {

  const resultTags = await fetch("/api/admin/tags/list?eventTagsOnly=1");
  const dataTags = await resultTags.json();

  const resultBands = await fetch("/api/admin/bands/list");
  const dataBands = await resultBands.json();

  const eventResult = await fetch("/api/admin/events/get?id=" + params.id);
  const eventData = await eventResult.json();

  return { event: eventData, bands: bandsData, tags: tagsData };
}