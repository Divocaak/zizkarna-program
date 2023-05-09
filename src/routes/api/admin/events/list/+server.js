import { pool } from "$lib/db/mysql.js";

export async function GET() {

    let toRet = [];
    let q = "SELECT e.id, e.label, e.date, e.fbEvent FROM event e ORDER BY e.date DESC";
    await pool.promise().query(q).then(([rows, fields]) => toRet = rows);
    return new Response(JSON.stringify(toRet));
}