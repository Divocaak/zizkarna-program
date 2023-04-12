import { mysqlconnFn } from "$lib/db/mysql";


export async function GET() {

    let mysqlconn = mysqlconnFn();

    var older = "SELECT e.id, e.label AS eventLabel, e.date, e.doors, e.cash, e.fbEvent, e.tickets, t.label AS tagLabel, t.bgColor, t.textColor FROM tag_in_event te INNER JOIN event e ON e.id=te.id_event INNER JOIN tag t ON t.id=te.id_tag WHERE e.date  < CURRENT_DATE() ORDER BY e.date ASC";
    var closest = "SELECT e.id, e.label AS eventLabel, e.date, e.doors, e.cash, e.fbEvent, e.tickets, t.label AS tagLabel, t.bgColor, t.textColor FROM tag_in_event te INNER JOIN event e ON e.id=te.id_event INNER JOIN tag t ON t.id=te.id_tag WHERE e.date >= CURRENT_DATE() ORDER BY e.date ASC LIMIT 3;";
    var future = "SELECT e.id, e.label AS eventLabel, e.date, e.doors, e.cash, e.fbEvent, e.tickets, t.label AS tagLabel, t.bgColor, t.textColor FROM tag_in_event te INNER JOIN event e ON e.id=te.id_event INNER JOIN tag t ON t.id=te.id_tag WHERE e.date > CURRENT_DATE() ORDER BY e.date ASC LIMIT 0 OFFSET 3;";

    let results = { "older": {}, "closest": {}, "future": {} };
    await mysqlconn.promise().query(older).then(([rows, fields]) => rows.forEach(row => jsonEvent(row, results, "older")));
    await mysqlconn.promise().query(closest).then(([rows, fields]) => rows.forEach(row => jsonEvent(row, results, "closest")));
    await mysqlconn.promise().query(future).then(([rows, fields]) => rows.forEach(row => jsonEvent(row, results, "future")));

    var toRet = {"older": [], "closest": [], "future": []};
    for (var event in results.older) {
        toRet.older.push(results.older[event]);
    }
    for (var event in results.closest) {
        toRet.closest.push(results.closest[event]);
    }
    for (var event in results.future) {
        toRet.future.push(results.future[event]);
    }

    return new Response(JSON.stringify(toRet));
}

function jsonEvent(row, results, jsonKey) {
    if (results[jsonKey][row["id"]] !== undefined) {
        results[jsonKey][row["id"]]["tags"].push({
            "label": row["tagLabel"],
            "bgColor": row["bgColor"],
            "textColor": row["textColor"]
        });
        return;
    }

    results[jsonKey][row["id"]] = {
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