export async function getEventDetailed({params, fetch}) {

    const result = await fetch("/api/events/get?id=" + params.id);
    const data = await result.json();

    const eventTagsResult = await fetch("/api/tagInEvent/get?id=" + params.id);
    const dataEventTags = await eventTagsResult.json();

    const resultBands = await fetch("/api/bandInEvent/get?id=" + params.id);
    const dataBands = await resultBands.json();

    for (let i = 0; i < dataBands.length; i++) {
        await fetch("/dynamic/bands/" + dataBands[i].id + "/band.json").then((res) => (!res.ok) ? { imgs: [], links: [] } : res.json()).then(function (data) {
            dataBands[i]["imgs"] = (data !== null) ? data.imgs : [];
            dataBands[i]["links"] = (data !== null) ? data.links : [];
        });

        const resultBandTags = await fetch("/api/tagInBand/get?id=" + dataBands[i].id);
        dataBands[i]["tags"] = await resultBandTags.json();
    }

    return {
        event: data,
        eventTags: dataEventTags,
        bands: dataBands
    }
}