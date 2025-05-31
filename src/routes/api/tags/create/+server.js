import { pool } from '$lib/db/mysql.js';

export async function POST({ request }) {
	const data = await request.json();

	await pool
		.promise()
		.query('INSERT INTO tag (label, bgColor, textColor, is_eventTag) VALUES (?, ?, ?, ?);', [
			data.label,
			data.bgColor,
			data.textColor,
			data.eventTag
		]);
	return new Response(JSON.stringify({ message: 'přidáno do db' }, { status: 200 }));
}
