import { pool } from '$lib/db/mysql.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ url }) {
  const date_from = url.searchParams.get('date_from')
  const date_to = url.searchParams.get('date_to')

  if (!date_from || !date_to) {
    throw error(400, 'date_from and date_to are required')
  }

  const p = [date_from, date_to]

  const [events] = await pool.query(`
      SELECT
        e.id,
        e.date,
        e.label,
        e.cash AS price_on_site,
        e.presalePrice,
        e.soldOnPlace,
        e.soldPresale,
        e.soldGuestList,
        GROUP_CONCAT(b.label ORDER BY bie.stageTime SEPARATOR ', ') AS bands
      FROM event e
      LEFT JOIN band_in_event bie ON bie.id_event = e.id
      LEFT JOIN band b ON b.id = bie.id_band
      WHERE e.is_visible = true AND e.date BETWEEN ? AND ?
      GROUP BY
        e.id,
        e.date,
        e.label,
        e.cash,
        e.presalePrice,
        e.soldOnPlace,
        e.soldPresale,
        e.soldGuestList
      ORDER BY e.date ASC;`, p)

  return json({ events });
}
