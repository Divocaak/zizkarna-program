import { pool } from '$lib/db/mysql.js';

export async function POST({ request }) {
	const data = await request.json();
	await pool
		.query(
			'UPDATE event SET soldOnPlace=?, soldPresale=?, soldGuestList=? WHERE id=?;',
			[
				data.onSite,
				data.presale,
				data.guest,
				data.id
			]
		);

	return new Response(JSON.stringify({ message: 'upraveno v db' }, { status: 200 }));
}
