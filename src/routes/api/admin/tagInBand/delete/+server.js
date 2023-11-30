import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    const arr = data.tags.split(",").map(element => [data.id, element]);
    console.log(arr);
    if (arr.length > 0)
        await pool.promise().query("DELETE FROM tag_in_band WHERE (id_band, id_tag) IN (?);", [arr]);
    return new Response(JSON.stringify({ message: "přidáno do db", status: 200 }));
}