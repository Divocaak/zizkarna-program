import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result = [];
    await pool.promise().query("SELECT t.id FROM tag_in_band tb INNER JOIN tag t ON tb.id_tag=t.id WHERE tb.id_band = ?;", url.searchParams.get("id"))
        .then(([rows, fields]) => rows.forEach(row => result.push(row["id"])));

    return new Response(JSON.stringify(result));
}