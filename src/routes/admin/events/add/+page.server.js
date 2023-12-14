import { ADMIN_PASSWORD } from "$env/static/private";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (formData.password !== ADMIN_PASSWORD) return "špatné heslo";

    const response = await event.fetch('/api/events/create', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        label: formData.label,
        date: formData.date,
        doors: formData.doors,
        cash: formData.cash,
        presale: formData.presale,
        fbEvent: formData.fbEvent != "" ? formData.fbEvent : null,
        tickets: formData.tickets != "" ? formData.tickets : null,
        description: formData.description != null ? formData.description : null,
        is_visible: formData.is_visible == "on"
      })
    });
    const result = await response.json();

    if (result.status != 200) return result.message;

    let newBandPairs = [];
    let newTagIds = [];
    Object.keys(formData).filter(function (key) {
      if (key.indexOf("tag-") == 0) {
        newTagIds.push(parseInt(key.replace("tag-", "")));
        delete formData[key];
      }

      if(key.indexOf("band-") == 0){
        if(key.indexOf("band-t") == 0) return;
        const id = key.replace("band-", "");
        const timeKey = "band-t" + id;
        const time = formData[timeKey] == "" ? null : formData[timeKey];
        newBandPairs.push([parseInt(id), time])
        delete formData[key];
        delete formData[timeKey];
      }
    });

    if (newTagIds.length > 0) {
      const tagsResponse = await event.fetch('/api/tagInEvent/createMultiple', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: result.message, tags: newTagIds })
      });
      var tagsResult = await tagsResponse.json();
      if (tagsResult.status != 200) return tagsResult.message;
    }
    
    if (newBandPairs.length > 0) {
      const bandsResponse = await event.fetch('/api/bandInEvent/insertUpdateMultiple', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: result.message, bands: newBandPairs })
      });
      var bandsResult = await bandsResponse.json();
      return bandsResult.message;
    }
    return result.message;
  }
};

export const load = async ({ params, fetch }) => {
  const resultTags = await fetch("/api/tags/list?eventTagsOnly=1");
  const dataTags = await resultTags.json();

  const resultBands = await fetch("/api/bands/list");
  const dataBands = await resultBands.json();

  return { tags: dataTags, bands: dataBands };
}