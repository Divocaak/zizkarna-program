import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result = await pool.promise().query("SELECT t.label, t.bgColor, t.textColor FROM tag_in_band tib INNER JOIN tag t ON tib.id_tag=t.id WHERE tib.id_band = ?;", url.searchParams.get("id"))
        .then(([rows, fields]) => rows);

    return new Response(JSON.stringify(result));
}