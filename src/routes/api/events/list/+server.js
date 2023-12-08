import { pool } from "$lib/db/mysql.js";

export async function GET() {
    const [rows, fields] = await pool.promise().query("SELECT id, label, date, doors, cash, presalePrice, fbEvent, tickets FROM event WHERE is_visible IS TRUE;");

    const result = await Promise.all(rows.map(row => getTags(row)));
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    return new Response(JSON.stringify(result));
}

async function getTags(event) {
    event["tags"] = [];

    const tagQuery = "SELECT t.label, t.bgColor, t.textColor FROM tag_in_event tib INNER JOIN tag t ON tib.id_tag=t.id WHERE tib.id_event = ?;";
    const [tagRows, tagFields] = await pool.promise().query(tagQuery, event["id"]);
    event["tags"] = event["tags"].concat(tagRows);

    const bandQuery = "SELECT t.label, t.bgColor, t.textColor FROM band_in_event bie INNER JOIN tag_in_band tie ON bie.id_band=tie.id_band INNER JOIN tag t ON tie.id_tag=t.id WHERE bie.id_event = ?;";
    const [bandRows, bandFields] = await pool.promise().query(bandQuery, event["id"]);
    event["tags"] = event["tags"].concat(bandRows);

    return event;
}