import { ADMIN_PASSWORD } from "$env/static/private";
import { URL } from "$env/static/private";
import fs from "fs";

export const load = async ({ params, fetch }) => {
  let band = {};
  const path = "@dynamic/bands/" + params.id + "/band.json";
  await fetch(path).then((res) => res.json()).then((data) => band = data).catch(() => {
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
    } catch (err) {
      return {"error": err}
    }
  });
  return band;
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";
    const response = await event.fetch('/api/admin/bands/create', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ label: formData.label, description: formData.description })
    });
    const result = await response.json();
    return result.message;
  }
};