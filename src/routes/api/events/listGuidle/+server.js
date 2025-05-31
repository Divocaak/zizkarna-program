import { pool } from "$lib/db/mysql.js";

export async function GET({ url }) {
    const year = url.searchParams.get("year");
    const month = url.searchParams.get("month");

    const query = `
        SELECT id, label, date, doors, cash, presalePrice, fbEvent, tickets, description
        FROM event
        WHERE YEAR(date) = ? AND MONTH(date) = ? AND is_visible IS TRUE
        ORDER BY date ASC;
    `;
    const [events] = await pool.promise().query(query, [year, month]);

    const result = await Promise.all(
        events.map(async (event) => {
            event.poster = `https://program.zizkarna.cz/dynamic/events/${event.id}.jpg`;
            await Promise.all([addTags(event), addBands(event, url)]);
            return event;
        })
    );

    return new Response(JSON.stringify(result));
}

async function addTags(event) {
    const tagQuery = `
        SELECT t.label
        FROM tag_in_event tib
        INNER JOIN tag t ON tib.id_tag = t.id
        WHERE tib.id_event = ?;
    `;
    const [directTags] = await pool.promise().query(tagQuery, [event.id]);

    const bandTagQuery = `
        SELECT DISTINCT t.label
        FROM band_in_event bie
        INNER JOIN tag_in_band tie ON bie.id_band = tie.id_band
        INNER JOIN tag t ON tie.id_tag = t.id
        WHERE bie.id_event = ? AND t.id <>174;
    `;
    const [bandTags] = await pool.promise().query(bandTagQuery, [event.id]);

    const labels = [...directTags, ...bandTags].map(tag => tag.label);
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
    const [bands] = await pool.promise().query(bandQuery, [event.id]);

    await Promise.all(
        bands.map(async (band) => {
            const origin = url.origin || "http://localhost:5173";
            const response = await fetch(`${origin}/dynamic/bands/${band.id}/band.json`);

            if (!response.ok) return;

            const json = await response.json();
            if (!json.links?.length) return;

            band.links = json.links;
            band.imgs = (json.imgs || []).map(
                img => `https://program.zizkarna.cz/dynamic/bands/${band.id}/${img}`
            );
        })
    );

    event.bands = bands;
    return event;
}