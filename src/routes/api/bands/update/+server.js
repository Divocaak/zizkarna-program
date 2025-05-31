import { pool } from '$lib/db/mysql.js';
import fs from 'fs';

export async function POST({ request }) {
	const data = await request.json();
	await pool
		.promise()
		.query('UPDATE band SET label=?, description=? WHERE id=?;', [
			data.label,
			data.description,
			data.id
		]);

	const jsonPath = './dynamic/bands/' + data.id + '/band.json';
	let jsonError = null;
	try {
		if (!fs.existsSync(jsonPath)) {
			fs.mkdirSync(jsonPath, { recursive: true });
		}
		fs.writeFileSync(jsonPath, data.json);
	} catch (err) {
		jsonError = 'error při zápisu';
	}

	return new Response(
		JSON.stringify(
			{ message: jsonError?.message ?? 'upraveno v db' },
			{ status: jsonError != null ? 500 : 200 }
		)
	);
}
