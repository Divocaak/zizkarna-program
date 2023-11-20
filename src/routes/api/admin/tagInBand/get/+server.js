import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result = {};
    await pool.promise().query("SELECT t.id, tb.id AS tag_in_band_id FROM tag_in_band tb INNER JOIN tag t ON tb.id_tag=t.id WHERE tb.id_band = ?;", url.searchParams.get("id"))
        .then(([rows, fields]) => rows.forEach(row => result[row["id"]] = row["tag_in_band_id"]));

    return new Response(JSON.stringify(result));
}