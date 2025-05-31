import { pool } from '$lib/db/mysql.js';

export async function GET({ request, params, url }) {
	let result;
	await pool
		.promise()
		.query(
			'SELECT id, label, date, doors, cash, presalePrice, fbEvent, tickets, description, is_visible, youtube FROM event WHERE id=?',
			url.searchParams.get('id')
		)
		.then(([rows, fields]) => (result = rows[0]));

	return new Response(JSON.stringify(result));
}
