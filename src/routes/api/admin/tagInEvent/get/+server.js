import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result = [];
    await pool.promise().query("SELECT t.id FROM tag_in_event te INNER JOIN tag t ON te.id_tag=t.id WHERE te.id_event = ?;", url.searchParams.get("id"))
        .then(([rows, fields]) => rows.forEach(row => result.push(row["id"])));

    return new Response(JSON.stringify(result));
}