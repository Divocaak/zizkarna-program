import { pool } from '$lib/db/mysql.js';

export async function GET() {
	let toRet = [];

	await pool
		.query('SELECT id, label, date, soldOnPlace AS onSite, soldPresale AS presale, soldGuestList AS guest, (soldOnPlace + soldPresale + soldGuestList) AS total FROM event ORDER BY date DESC;')
		.then(([rows, fields]) => (toRet = rows));
	return new Response(JSON.stringify(toRet));
}
