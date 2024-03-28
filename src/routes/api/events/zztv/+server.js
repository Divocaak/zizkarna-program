import { pool } from "$lib/db/mysql.js";

export async function GET() {
    let toRet = [];
    await pool.promise().query("SELECT label, youtube FROM event WHERE youtube IS NOT NULL;").then(([rows, fields]) => toRet = rows);
    return new Response(JSON.stringify(toRet));
}