import { pool } from '$lib/db/mysql.js';

export async function GET() {
	let toRet = [];
	let q = 'SELECT id, label FROM band ORDER BY label ASC';
	await pool
		.promise()
		.query(q)
		.then(([rows, fields]) => (toRet = rows));
	return new Response(JSON.stringify(toRet));
}
