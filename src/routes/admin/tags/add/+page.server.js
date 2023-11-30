import { ADMIN_PASSWORD } from "$env/static/private";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";
    const response = await event.fetch('/api/admin/tags/create', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ label: formData.label, bgColor: formData.bgColor.slice(1), textColor: formData.textColor.slice(1), eventTag: formData.eventTag == "on" })
    });
    const result = await response.json();
    return result.message;
  }
};