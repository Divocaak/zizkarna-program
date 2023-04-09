import mysql from 'mysql2';

let mysqlconn = null;

export function mysqlconnFn() {

    if (!mysqlconn) {
        // URGENT env vars
        // https://joyofcode.xyz/sveltekit-environment-variables
        mysqlconn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Pgema333',
            database: 'zizkarna_program',
            socketPath: "/tmp/mysql.sock"
        });

        mysqlconn.connect(function (err) {
            if (err) throw err;
        });
    }

    return mysqlconn;
}