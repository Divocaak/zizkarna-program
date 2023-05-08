import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();

    await pool.promise()
        .query("INSERT INTO active_users (user_id, position, datetime_from, datetime_to) VALUES (?, ST_SRID(POINT(?, ?), 4326), ?, ?);",
            [data.userId, data.lat, data.lon, data.timeFrom, data.timeTo])
        .then(function ([rows, fields]) {
            // success
        });

    return new Response(JSON.stringify({ message: "succ?" }, { status: 200 }));
}