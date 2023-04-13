import { mysqlconnFn } from "$lib/db/mysql";


export async function GET({ request, params, url }) {

    let mysqlconn = mysqlconnFn();

    let results =
        await mysqlconn.promise()
            .query("SELECT b.id, b.label, b.description FROM band_in_event be INNER JOIN band b ON be.id_band=b.id WHERE be.id_event = ?;", url.searchParams.get("id"))
            .then(function ([rows, fields]) {
                return rows;
            });

    return new Response(JSON.stringify(results));
}