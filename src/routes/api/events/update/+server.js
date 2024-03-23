
import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    await pool.promise().query("UPDATE event SET is_visible=?, label=?, date=?, doors=?, cash=?, presalePrice=?, fbEvent=?, tickets=?, description=?, youtube=? WHERE id=?;", [
        data.is_visible,
        data.label,
        data.date,
        data.doors,
        data.cash,
        data.presale != "" ? data.presale : null,
        data.fbEvent != "" ? data.fbEvent : null,
        data.tickets != "" ? data.tickets : null,
        data.description != "" ? data.description : null,
        data.yt,
        data.id
    ]);

    return new Response(JSON.stringify({ message: "upraveno v db" }, { status: 200 }));
}