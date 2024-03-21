import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {

    let toRet = [];

    let q = "SELECT label, date, tickets FROM event WHERE is_visible IS TRUE AND YEAR(date) = ? AND MONTH(date) = ? ORDER BY date ASC;";
    await pool.promise().query(q, [url.searchParams.get("year"), url.searchParams.get("month")]).then(([rows, fields]) => toRet = rows);
    return new Response(JSON.stringify(toRet));
}