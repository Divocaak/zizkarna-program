import { ADMIN_PASSWORD } from "$env/static/private";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    let formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";

    const response = await event.fetch('/api/bands/create', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();

    if (result.status != 200) return result.message;

    let newTagIds = [];
    Object.keys(formData).filter(function (key) {
      if (key.indexOf("tag-") == 0) {
        newTagIds.push(parseInt(key.replace("tag-", "")));
        delete formData[key];
      }
    });

    if (newTagIds.length > 0) {
      const tagsResponse = await event.fetch('/api/tagInBand/createMultiple', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: result.message, tags: newTagIds })
      });
      var tagsResult = await tagsResponse.json();
    }

    return tagsResult.message;
  }
};

export const load = async ({ params, fetch }) => {
  const result = await fetch("/api/tags/list?eventTagsOnly=0");
  const data = await result.json();

  return { tags: data };
}