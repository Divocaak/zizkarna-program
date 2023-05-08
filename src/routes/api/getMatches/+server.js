import { pool } from "$lib/db/mysql.js";

export async function GET({ }) {

    let toRet;
    await pool.promise()
        .query("SELECT id, user_id, ST_X(position) AS x, ST_Y(position) AS y, datetime_from, datetime_to FROM active_users")
        .then(function ([rows, fields]) {
            toRet = rows;
        });

    return new Response(JSON.stringify({ message: "succ?", data: toRet }, { status: 200 }));
}