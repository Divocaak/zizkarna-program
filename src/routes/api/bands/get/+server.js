import { pool } from '$lib/db/mysql.js';

export async function GET({ request, params, url }) {
	let result;
	await pool
		.promise()
		.query('SELECT label, description FROM band WHERE id=?;', url.searchParams.get('id'))
		.then(([rows, fields]) => (result = rows[0]));

	return new Response(JSON.stringify(result));
}
