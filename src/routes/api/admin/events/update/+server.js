
import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    await pool.promise().query("UPDATE event SET is_visible=?, label=?, date=?, doors=?, cash=?, presalePrice=?, fbEvent=?, tickets=?, description=? WHERE id=?;", [
        data.is_visible,
        data.label,
        data.date,
        data.doors,
        data.cash,
        data.presale != "" ? data.presale : null,
        data.fbEvent != "" ? data.fbEvent : null,
        data.tickets != "" ? data.tickets : null,
        data.description != "" ? data.description : null,
        data.id
    ]);

    // TODO EVENT rewrite new band/tag sys mby??
    /* let bandInserts = [];
    data.bands.forEach(bandId => {
        if (isNaN(bandId)) return;
        bandInserts.push([data.id, bandId]);
    });
    if (bandInserts.length > 0)
        await pool.promise().query("INSERT INTO band_in_event (id_event, id_band) VALUES ?;", [bandInserts]);
     */

    return new Response(JSON.stringify({ message: "upraveno v db" }, { status: 200 }));
}