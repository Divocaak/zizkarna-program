import { pool } from "$lib/db/mysql.js";

export async function GET() {

    let toRet = [];

    let q = "SELECT id, label, date, doors, cash, presalePrice, fbEvent, tickets, is_visible, youtube FROM event ORDER BY date DESC;";
    await pool.promise().query(q).then(([rows, fields]) => toRet = rows);
    return new Response(JSON.stringify(toRet));
}