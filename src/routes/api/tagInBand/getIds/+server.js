import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result = [];
    await pool.promise().query("SELECT id_tag FROM tag_in_band WHERE id_band = ?;", url.searchParams.get("id"))
        .then(([rows, fields]) => rows.forEach(row => result.push(row["id_tag"])));

    return new Response(JSON.stringify(result));
}