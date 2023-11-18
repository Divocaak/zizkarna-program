import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();

    let tagInserts = [];
    data.tags.forEach(tagId => {
        if (isNaN(tagId)) return;
        tagInserts.push([data.id, tagId]);
    });

    if (tagInserts.length > 0)
        await pool.promise().query("INSERT INTO tag_in_band (id_band, id_tag) VALUES ?;", [tagInserts]);
    return new Response(JSON.stringify({ message: "přidáno do db" }, { status: 200 }));
}