import { ADMIN_PASSWORD } from "$env/static/private";
import fs from "fs";

export const load = async ({ params, fetch }) => {
  const result = await fetch("/api/admin/bands/get?id=" + params.id);
  const data = await result.json();

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

  return { id: params.id, json: band, label: data.label, description: data.description };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";
    const jsonPath = "./dynamic/bands/" + formData.id + "/band.json";
    try {
      if (!fs.existsSync(jsonPath)) {
        fs.mkdirSync(jsonPath, { recursive: true });
      }
      fs.writeFileSync(jsonPath, formData.json);
    } catch (err) {
      return "error při zápisu"
    }
    return "upraveno";
  }
};