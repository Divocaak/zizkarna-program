import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

export async function GET({ url }) {
	const year = url.searchParams.get('year');
	const month = url.searchParams.get('month');

	let query;
	if (year && month)
		query = `
        	SELECT id, label, date, doors, cash, presalePrice, fbEvent, tickets, description
        	FROM event
        	WHERE YEAR(date) = ? AND MONTH(date) = ? AND is_visible IS TRUE
        	ORDER BY date ASC;`;
	else
		query = `
				SELECT id, label, date, doors, cash, presalePrice, fbEvent, tickets, description
				FROM event
				WHERE date >= CURDATE() AND is_visible IS TRUE
				ORDER BY date ASC;`;
	const [events] = await pool.query(query, [year, month]);

	const result = await Promise.all(
		events.map(async (event) => {
			const posterFile = path.join(
				process.cwd(),
				'dynamic',
				'events',
				`${event.id}.jpg`
			);
			const exists = existsSync(posterFile);
			event.poster = exists
				? `https://program.zizkarna.cz/dynamic/events/${event.id}.jpg`
				: `https://program.zizkarna.cz/dynamic/events/placeholder.jpg`;

			event.venue = {
				"label": "Žižkárna",
				"address": "Žižkova tř. 28, České Budějovice"
			};
			event.contact = {
				"name": "Vojtěch Divoký",
				"email": "info@zizkarna.cz",
				"tel": "722680481"
			}

			await Promise.all([addTags(event), addBands(event, url)]);
			return event;
		})
	);

	return json(result);
}

async function addTags(event) {
	const tagQuery = `
        SELECT t.label
        FROM tag_in_event tib
        INNER JOIN tag t ON tib.id_tag = t.id
        WHERE tib.id_event = ?;
    `;
	const [directTags] = await pool.query(tagQuery, [event.id]);

	const bandTagQuery = `
        SELECT DISTINCT t.label
        FROM band_in_event bie
        INNER JOIN tag_in_band tie ON bie.id_band = tie.id_band
        INNER JOIN tag t ON tie.id_tag = t.id
        WHERE bie.id_event = ? AND t.id <>174;
    `;
	const [bandTags] = await pool.query(bandTagQuery, [event.id]);

	const labels = [...directTags, ...bandTags].map((tag) => tag.label);
	event.tags = Array.from(new Set(labels));

	return event;
}

async function addBands(event, url) {
	const bandQuery = `
        SELECT b.id, b.label, b.description, bie.stageTime
        FROM band_in_event bie
        INNER JOIN band b ON bie.id_band = b.id
        WHERE bie.id_event = ?
        ORDER BY bie.stageTime ASC;
    `;
	const [bands] = await pool.query(bandQuery, [event.id]);

	await Promise.all(
		bands.map(async (band) => {
			const filePath = path.join(
				process.cwd(),
				'static',
				'dynamic',
				'bands',
				String(band.id),
				'band.json'
			);
			if (!existsSync(filePath)) return;
			const json = JSON.parse(readFileSync(filePath, 'utf-8'));
			if (!json.links?.length) return;

			band.links = json.links;
			band.imgs = (json.imgs || []).map(
				(img) => `https://program.zizkarna.cz/dynamic/bands/${band.id}/${img}`
			);
		})
	);

	event.bands = bands;
	return event;
}
