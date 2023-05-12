import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();

    await pool.promise().query("INSERT INTO event (label, date, doors, cash, fbEvent, tickets) VALUES (?, ?, ?, ?, ?, ?);",
        [data.label,
        data.date,
        data.doors,
        data.cash,
        data.fbEvent,
        data.tickets]);
    return new Response(JSON.stringify({ message: "přidáno do db" }, { status: 200 }));
}