import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {

    const result = {};
    await pool.promise()
        .query(`SELECT e.id AS eventId, e.label AS eventLabel, e.date, b.id AS bandId, b.label AS bandLabel FROM band_in_event be 
            INNER JOIN event e ON e.id=be.id_event
            INNER JOIN band b ON b.id=be.id_band
            WHERE is_visible IS TRUE
            AND YEAR(e.date) = ? AND MONTH(e.date) = ?
            ORDER BY e.date ASC;`, [url.searchParams.get("year"), url.searchParams.get("month")])
        .then(([rows, fields]) => rows.forEach(row => {
            if (result[row["eventId"]] === undefined) result[row["eventId"]] = { label: row["eventLabel"], date: row["date"], bands: [] };
            result[row["eventId"]].bands.push({ id: row["bandId"], label: row["bandLabel"] })
        }));

    return new Response(JSON.stringify(result));
}