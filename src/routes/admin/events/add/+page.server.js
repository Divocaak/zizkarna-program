import { ADMIN_PASSWORD } from "$env/static/private";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";
    const response = await event.fetch('/api/admin/events/create', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        label: formData.label,
        date: formData.date,
        doors: formData.doors,
        cash: formData.cash,
        fbEvent: formData.fbEvent != "" ? formData.fbEvent : null,
        tickets: formData.tickets != "" ? formData.tickets : null,
        description: formData.description != null ? formData.description : null
      })
    });
    const result = await response.json();
    return result.message;
  }
};