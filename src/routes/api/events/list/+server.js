import { pool } from '$lib/db/mysql.js';

export async function GET() {
	try {
		// Fetch all visible events
		const [events] = await pool.query(
			`SELECT id, label, date, doors, cash, presalePrice, fbEvent, tickets, youtube
			 FROM event
			 WHERE is_visible IS TRUE`
		);

		if (events.length === 0) return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });

		const eventIds = events.map(e => e.id);

		// Fetch all tags (event tags + band tags) using UNION to avoid nulls
		const [tagRows] = await pool.query(
			`SELECT e.id AS event_id, t.id AS tag_id, t.label, t.bgColor, t.textColor
			 FROM event e
			 JOIN tag_in_event tie ON e.id = tie.id_event
			 JOIN tag t ON tie.id_tag = t.id
			 WHERE e.id IN (?)
			 UNION
			 SELECT e.id AS event_id, t.id AS tag_id, t.label, t.bgColor, t.textColor
			 FROM event e
			 JOIN band_in_event bie ON e.id = bie.id_event
			 JOIN tag_in_band tib ON bie.id_band = tib.id_band
			 JOIN tag t ON tib.id_tag = t.id
			 WHERE e.id IN (?)`,
			[eventIds, eventIds]
		);

		// Group tags per event
		const tagsByEvent = new Map();
		for (const row of tagRows) {
			if (!tagsByEvent.has(row.event_id)) tagsByEvent.set(row.event_id, []);
			tagsByEvent.get(row.event_id).push({
				id: row.tag_id,
				label: row.label,
				bgColor: row.bgColor,
				textColor: row.textColor
			});
		}

		// Attach tags to events
		const result = events.map(event => ({
			...event,
			tags: tagsByEvent.get(event.id) || []
		}));

		// Sort by date
		result.sort((a, b) => new Date(a.date) - new Date(b.date));

		return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
	} catch (err) {
		console.error('Error fetching events:', err);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
	}
}
