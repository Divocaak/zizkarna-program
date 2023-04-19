import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SOCKET } from "$env/static/private";
import mysql from 'mysql2';

export var pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    socketPath: DB_SOCKET
});

pool.getConnection((err, connection) => {
    if (err)
        throw err;
    console.log('Database connected successfully');
    connection.release();
});