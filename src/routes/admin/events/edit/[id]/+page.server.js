import { ADMIN_PASSWORD } from "$env/static/private";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";

    let newTagIds = [];
    Object.keys(formData).filter(function (key) {
      if (key.indexOf("tag-") == 0) {
        newTagIds.push(parseInt(key.replace("tag-", "")));
        delete formData[key];
      }
    });

    if (newTagIds.length > 0) {
      const tagsResponse = await event.fetch('/api/admin/tagInEvent/createMultiple', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: formData.id, tags: newTagIds })
      });
      const tagsResult = await tagsResponse.json();
      if (tagsResult.status != 200) return tagsResult.message;
    }

    if (formData.removedTagsIds != undefined) {
      const oldTagsResponse = await event.fetch('/api/admin/tagInEvent/delete', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: formData.id, tags: formData.removedTagsIds })
      });
      const oldTagsResult = await oldTagsResponse.json();
      if (oldTagsResult.status != 200) return oldTagsResult.message;
    }

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

  const result = await fetch("/api/admin/events/get?id=" + params.id);
  const data = await result.json();

  const resultTags = await fetch("/api/admin/tags/list?eventTagsOnly=1");
  const dataTags = await resultTags.json();

  const resultSelectedTags = await fetch("/api/admin/tagInEvent/get?id=" + params.id)
  const dataSelectedTags = await resultSelectedTags.json();

  const resultBands = await fetch("/api/admin/bands/list");
  const dataBands = await resultBands.json();

  return { event: data, bands: dataBands, tags: dataTags, selectedTags: dataSelectedTags };
}