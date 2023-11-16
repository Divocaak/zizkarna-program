import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result;
    await pool.promise().query("SELECT label, description FROM band WHERE id=?;", url.searchParams.get("id"))
        .then(function ([rows, fields]) {
            rows.forEach(row => {
                result = {
                    "label": row["label"],
                    "description": row["description"]
                };
            });
        });
    return new Response(JSON.stringify(result));
}