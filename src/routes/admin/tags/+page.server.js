export const load = async ({params, fetch}) => {

    const resultBand = await fetch("/api/admin/tags/list?eventTagsOnly=0");
    const dataBand = await resultBand.json();

    const resultEvent = await fetch("/api/admin/tags/list?eventTagsOnly=1");
    const dataEvent = await resultEvent.json();

    return {band: dataBand, event: dataEvent};
}