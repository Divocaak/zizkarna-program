import { mysqlconnFn } from "$lib/db/mysql";


export async function GET({request, params, url}) {

    let mysqlconn = mysqlconnFn();

    var seekId = url.searchParams.get("id");
    var q = "SELECT e.id, e.label AS eventLabel, e.date, e.doors, e.cash, e.fbEvent, e.tickets, t.label AS tagLabel, t.bgColor, t.textColor FROM tag_in_event te INNER JOIN event e ON e.id=te.id_event INNER JOIN tag t ON t.id=te.id_tag;";
    var qId = "SELECT e.id, e.label AS eventLabel, e.date, e.doors, e.cash, e.fbEvent, e.tickets, t.label AS tagLabel, t.bgColor, t.textColor FROM tag_in_event te INNER JOIN event e ON e.id=te.id_event INNER JOIN tag t ON t.id=te.id_tag WHERE e.id = ?;";
    
    let results = {};
    await mysqlconn.promise()
        .query(seekId == null ? q : qId, seekId)
        .then(function ([rows, fields]) {
            rows.forEach(row => {
                if (results[row["id"]] !== undefined) {
                    results[row["id"]]["tags"].push({
                        "label": row["tagLabel"],
                        "bgColor": row["bgColor"],
                        "textColor": row["textColor"]
                    });
                    return;
                }

                results[row["id"]] = {
                    "id": row["id"],
                    "eventLabel": row["eventLabel"],
                    "date": row["date"],
                    "doors": row["doors"],
                    "cash": row["cash"],
                    "fbEvent": row["fbEvent"],
                    "tickets": row["tickets"],
                    "label": row["label"],
                    "tags": [
                        {
                            "label": row["tagLabel"],
                            "bgColor": row["bgColor"],
                            "textColor": row["textColor"]
                        }
                    ]
                };

            });
        });

    let resultsArray = [];
    for(var element in results){
        resultsArray.push(results[element]);
    }

    return new Response(JSON.stringify(resultsArray));
}