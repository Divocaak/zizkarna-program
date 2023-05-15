
import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();

    let bandInserts = [];
    data.bands.forEach(bandId => {
        if (isNaN(bandId)) return;
        bandInserts.push([data.id, bandId]);
    });
    if (bandInserts.length > 0)
        await pool.promise().query("INSERT INTO band_in_event (id_event, id_band) VALUES ?;", [bandInserts]);

    let tagInserts = [];
    data.tags.forEach(tagId => {
        if (isNaN(tagId)) return;
        tagInserts.push([data.id, tagId]);
    });
    if (tagInserts.length > 0)
        await pool.promise().query("INSERT INTO tag_in_event (id_event, id_tag) VALUES ?;", [tagInserts]);

    return new Response(JSON.stringify({ message: "přidáno do db" }, { status: 200 }));
}