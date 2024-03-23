import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    const [sql, _] = await pool.promise().query("INSERT INTO event (label, date, doors, cash, presalePrice, fbEvent, tickets, description, is_visible, youtube) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [
        data.label,
        data.date,
        data.doors,
        data.cash,
        data.presale,
        data.fbEvent,
        data.tickets,
        data.description,
        data.is_visible,
        data.yt
    ]);

    return new Response(JSON.stringify({ status: 200, message: sql.insertId }, { status: 200 }));
}