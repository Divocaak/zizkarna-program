import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {

    let toRet = [];

    let q = "SELECT label, date FROM event WHERE is_visible IS TRUE AND YEAR(date) = ? AND WEEK(date, 1) = ? ORDER BY date ASC;";
    await pool.promise().query(q, [url.searchParams.get("year"), url.searchParams.get("week")]).then(([rows, fields]) => toRet = rows);
    return new Response(JSON.stringify(toRet));
}