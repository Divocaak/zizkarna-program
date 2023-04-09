export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/event?id=" + params.id);
    const data = await result.json();

    const resultBands = await fetch("/api/bandsFromEvent?id=" + params.id);
    const dataBands = await resultBands.json();

    for (let i = 0; i < dataBands.length; i++) {
        let band = dataBands[i];
        let json = await import(/* @vite-ignore */ "../../../static/bandImgs/" + band.id + "/band.json");
        band["imgs"] = json.imgs;
        band["links"] = json.links;
    }

    return {
        event: data,
        bands: dataBands
    }
}