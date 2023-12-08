import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result = {};
    await pool.promise().query("SELECT id_band, stageTime FROM band_in_event WHERE id_event = ?;", url.searchParams.get("id"))
        .then(([rows, fields]) => rows.forEach(row => result[row["id_band"]] = row["stageTime"]));

    return new Response(JSON.stringify(result));
}