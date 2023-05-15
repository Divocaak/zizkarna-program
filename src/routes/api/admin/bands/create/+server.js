import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();

    await pool.promise().query("INSERT INTO band (label, description) VALUES (?, ?);", [data.label, data.description]);
    return new Response(JSON.stringify({ message: "přidáno do db"}, { status: 200 }));
}