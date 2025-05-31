import { pool } from '$lib/db/mysql.js';

export async function GET({ request, params, url }) {
	let result = await pool
		.promise()
		.query(
			'SELECT b.id, b.label, b.description, bie.stageTime FROM band_in_event bie INNER JOIN band b ON bie.id_band=b.id WHERE bie.id_event = ? ORDER BY bie.stageTime ASC;',
			url.searchParams.get('id')
		)
		.then(([rows, fields]) => rows);

	return new Response(JSON.stringify(result));
}
