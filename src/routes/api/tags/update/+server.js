import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();

    await pool.promise().query("UPDATE tag SET label=?, bgColor=?, textColor=?, is_eventTag=? WHERE id=?", [data.label, data.bgColor, data.textColor, data.eventTag, data.id]);
    return new Response(JSON.stringify({ message: "upraveno v db" }, { status: 200 }));
}