import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/event?id=" + params.id);
    const data = await result.json();

    const resultBands = await fetch("/api/bandsFromEvent?id=" + params.id);
    const dataBands = await resultBands.json();

    for (let i = 0; i < dataBands.length; i++) {

        let json = null;
        // NOTE local
        //json = await require("../../../static/bands/" + dataBands[i].id  + "/band.json");
        // BUG
        // NOTE server
        json = await require("../../client/bands/" + dataBands[i].id + "/band.json");

        dataBands[i]["imgs"] = (json !== null) ? json.imgs : [];
        dataBands[i]["links"] = (json !== null) ? json.links : [];
    }

    return {
        event: data,
        bands: dataBands
    }
}