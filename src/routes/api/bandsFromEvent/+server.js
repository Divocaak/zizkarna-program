import {pool} from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {

    let results =
        await pool.promise()
            .query("SELECT b.id, b.label, b.description FROM band_in_event be INNER JOIN band b ON be.id_band=b.id WHERE be.id_event = ?;", url.searchParams.get("id"))
            .then(function ([rows, fields]) {
                return rows;
            });

    return new Response(JSON.stringify(results));
}