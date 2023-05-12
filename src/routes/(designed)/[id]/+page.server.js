import { URL } from "$env/static/private";

export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/event?id=" + params.id);
    const data = await result.json();

    const resultBands = await fetch("/api/bandsFromEvent?id=" + params.id);
    const dataBands = await resultBands.json();

    for (let i = 0; i < dataBands.length; i++) {
        // URGENT change env var
        // BUG json does not exist until created via admin!!
        await fetch("$dynamic/bands/" + dataBands[i].id + "/band.json").then((res) => res.json()).then(function (data){
            dataBands[i]["imgs"] = (data !== null) ? data.imgs : [];
            dataBands[i]["links"] = (data !== null) ? data.links : [];
        });
    }

    return {
        event: data,
        bands: dataBands
    }
}