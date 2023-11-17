import { pool } from "$lib/db/mysql.js";
import fs from "fs";

export async function POST({ request }) {

    const data = await request.json();
    const [sql, _] = await pool.promise().query("INSERT INTO band (label, description) VALUES (?, ?);", [data.label, data.description]);
    
    // json creation
    const path = "./dynamic/bands/" + sql.insertId;
    const jsonPath = path + "/band.json";
    let jsonError = null;
    try {
        fs.mkdirSync(path, { recursive: true });
        fs.writeFileSync(jsonPath, data.json);
    } catch (err) {
        jsonError = err;
    }

    return new Response(JSON.stringify({ message: jsonError?.message ?? "přidáno do db" }, { status: jsonError != null ? 500 : 200 }));
}