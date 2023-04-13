import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SOCKET } from "$env/static/private";
import mysql from 'mysql2';

let mysqlconn = null;

export function mysqlconnFn() {

    if (!mysqlconn) {
        mysqlconn = mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            socketPath: DB_SOCKET
        });

        mysqlconn.connect(function (err) {
            if (err) throw err;
        });
    }

    return mysqlconn;
}