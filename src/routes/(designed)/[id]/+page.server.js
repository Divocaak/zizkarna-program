import { URL } from "$env/static/private";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/event?id=" + params.id);
    const data = await result.json();

    const resultBands = await fetch("/api/bandsFromEvent?id=" + params.id);
    const dataBands = await resultBands.json();

    for (let i = 0; i < dataBands.length; i++) {

        await fetch(URL + "/dynamic/bands/" + dataBands[i].id + "/band.json").then((res) => res.json()).then(function (data){
            dataBands[i]["imgs"] = (data !== null) ? data.imgs : [];
            dataBands[i]["links"] = (data !== null) ? data.links : [];
        });

    }

    return {
        event: data,
        bands: dataBands
    }
}