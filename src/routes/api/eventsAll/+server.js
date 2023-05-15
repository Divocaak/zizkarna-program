import { pool } from "$lib/db/mysql.js";

export async function GET() {

    var older = "SELECT e.id, e.label AS eventLabel, e.date, e.doors, e.cash, e.fbEvent, e.tickets, t.label AS tagLabel, t.bgColor, t.textColor FROM tag_in_event te INNER JOIN event e ON e.id=te.id_event INNER JOIN tag t ON t.id=te.id_tag WHERE e.date < CURRENT_DATE() ORDER BY e.date DESC";
    var closest = "SELECT e.id, e.label AS eventLabel, e.date, e.doors, e.cash, e.fbEvent, e.tickets, t.label AS tagLabel, t.bgColor, t.textColor FROM tag_in_event te INNER JOIN event e ON e.id=te.id_event INNER JOIN tag t ON t.id=te.id_tag WHERE e.date >= CURRENT_DATE() ORDER BY e.date ASC";

    let results = { "older": {}, "closest": {} };
    await pool.promise().query(older).then(([rows, fields]) => rows.forEach(row => jsonEvent(row, results, "older")));
    await pool.promise().query(closest).then(([rows, fields]) => rows.forEach(row => jsonEvent(row, results, "closest")));

    var toRet = { "older": [], "closest": [] };
    for (var event in results.older) {
        toRet.older.push(results.older[event]);
    }
    for (var event in results.closest) {
        toRet.closest.push(results.closest[event]);
    }

    return new Response(JSON.stringify(toRet));
}

function jsonEvent(row, results, jsonKey) {
    let idKey = "x" + row["id"];
    if (results[jsonKey][idKey] !== undefined) {
        results[jsonKey][idKey]["tags"].push({
            "label": row["tagLabel"],
            "bgColor": row["bgColor"],
            "textColor": row["textColor"]
        });
        return;
    }

    results[jsonKey][idKey] = {
        "id": row["id"],
        "eventLabel": row["eventLabel"],
        "date": row["date"],
        "doors": row["doors"],
        "cash": row["cash"],
        "fbEvent": row["fbEvent"],
        "tickets": row["tickets"],
        "tags": [
            {
                "label": row["tagLabel"],
                "bgColor": row["bgColor"],
                "textColor": row["textColor"]
            }
        ]
    };
}