import { pool } from '$lib/db/mysql.js';

export async function GET({ request, params, url }) {
	let toRet = [];
	await pool
		.promise()
		.query(
			'SELECT id, label, bgColor, textColor, is_eventTag as eventTag FROM tag WHERE is_eventTag=? ORDER BY label ASC',
			url.searchParams.get('eventTagsOnly')
		)
		.then(([rows, fields]) => (toRet = rows));
	return new Response(JSON.stringify(toRet));
}
