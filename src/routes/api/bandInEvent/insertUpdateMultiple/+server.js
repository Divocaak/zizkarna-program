import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();

    let bandInserts = [];
    data.bands.forEach(bandPair => {
        bandInserts.push([data.id, bandPair[0], bandPair[1]]);
    });

    if (bandInserts.length > 0)
        await pool.promise().query("INSERT INTO band_in_event (id_event, id_band, stageTime) VALUES ? ON DUPLICATE KEY UPDATE stageTime=VALUES(stageTime);", [bandInserts]);
    return new Response(JSON.stringify({ message: "přidáno do db", status: 200 }));
}