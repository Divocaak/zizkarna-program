import { pool } from "$lib/db/mysql.js";

export async function GET() {

    let result = [];
    // TODO limit
    await pool.promise()
        .query("SELECT id, label, date, doors, cash, presalePrice, fbEvent, tickets FROM event WHERE is_visible IS TRUE ORDER BY date ASC LIMIT 2")
        .then(([rows, fields]) => rows.forEach(async row => result.push(await getTags(row)))
        );

    return new Response(JSON.stringify(result));
}

async function getTags(event) {
    event["tags"] = [];
    await pool.promise().query("SELECT t.label, t.bgColor, t.textColor FROM tag_in_event tib INNER JOIN tag t ON tib.id_tag=t.id WHERE tib.id_event = ?;", event["id"])
        .then(([rows, fields]) => rows.forEach(row => event["tags"].push(row)));
    await pool.promise().query("SELECT t.label, t.bgColor, t.textColor FROM band_in_event bie INNER JOIN tag_in_band tie ON bie.id_band=tie.id_band INNER JOIN tag t ON tie.id_tag=t.id WHERE bie.id_event = ?;", event["id"])
        .then(([rows, fields]) => rows.forEach(row => event["tags"].push(row)));
    return event;
}