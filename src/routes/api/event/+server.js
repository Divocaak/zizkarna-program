import {pool} from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {

    let result = {};
    await pool.promise()
        .query("SELECT e.id, e.label AS eventLabel, e.date, e.doors, e.cash, e.presalePrice, e.fbEvent, e.tickets, e.description, t.label AS tagLabel, t.bgColor, t.textColor FROM tag_in_event te INNER JOIN event e ON e.id=te.id_event INNER JOIN tag t ON t.id=te.id_tag WHERE e.id = ?;", url.searchParams.get("id"))
        .then(function ([rows, fields]) {
            rows.forEach(row => {
                if (result["tags"] !== undefined) {
                    result["tags"].push({
                        "label": row["tagLabel"],
                        "bgColor": row["bgColor"],
                        "textColor": row["textColor"]
                    });
                    return;
                }

                result = {
                    "id": row["id"],
                    "eventLabel": row["eventLabel"],
                    "date": row["date"],
                    "doors": row["doors"],
                    "cash": row["cash"],
                    "presale": row["presalePrice"],
                    "fbEvent": row["fbEvent"],
                    "tickets": row["tickets"],
                    "tags": [
                        {
                            "label": row["tagLabel"],
                            "bgColor": row["bgColor"],
                            "textColor": row["textColor"]
                        }
                    ],
                    "description": row["description"]
                };
            });
        });

    return new Response(JSON.stringify(result));
}