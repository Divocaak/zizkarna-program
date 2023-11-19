import { ADMIN_PASSWORD } from "$env/static/private";
import fs from "fs";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    console.log(formData);
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";

    const response = await event.fetch('/api/admin/bands/update', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    return result.message;
  }
};

export const load = async ({ params, fetch }) => {
  const result = await fetch("/api/admin/bands/get?id=" + params.id);
  const data = await result.json();

  const resultTags = await fetch("/api/admin/tagInBand/get?id=" + params.id);
  const dataTags = await resultTags.json();
  let selectedTags = [];
  dataTags.forEach(tag => selectedTags.push(tag.id));

  const resultTagsAll = await fetch("/api/admin/tags/list?eventTagsOnly=0");
  const dataTagsAll = await resultTagsAll.json();

  let band = { links: [], imgs: [] };
  const path = "/dynamic/bands/" + params.id;
  const jsonPath = path + "/band.json";
  await fetch(jsonPath).then((res) => res.json()).then((data) => band = data).catch(() => {
    try {
      if (!fs.existsSync("." + jsonPath)) {
        fs.mkdirSync("." + path, { recursive: true });
        fs.writeFileSync("." + jsonPath, JSON.stringify(band));
      }
    } catch (err) {
      return { "error": err };
    }
  });

  return { id: params.id, json: band, label: data.label, description: data.description, tags: dataTagsAll, selectedTags: selectedTags };
}