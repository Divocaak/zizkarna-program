import { json, error } from '@sveltejs/kit'
import { pool } from '$lib/db/mysql.js'

export async function GET({ url }) {
	const date_from = url.searchParams.get('date_from')
	const date_to = url.searchParams.get('date_to')

	if (!date_from || !date_to) {
		throw error(400, 'date_from and date_to are required')
	}

	const p = [date_from, date_to]

	/* =====================================================
	   1. EVENT PERFORMANCE METRICS
	===================================================== */

	const [[event_performance]] = await pool.query(`
    SELECT
      COUNT(*) AS total_events,
      SUM(soldOnPlace + soldPresale + soldGuestList) AS total_attendance,
      AVG(soldOnPlace + soldPresale + soldGuestList) AS avg_attendance,
      AVG(soldGuestList / NULLIF(soldOnPlace + soldPresale + soldGuestList,0)) AS avg_guest_ratio,
      AVG(soldPresale / NULLIF(soldPresale + soldOnPlace,0)) AS avg_presale_ratio,
      AVG((soldOnPlace + soldPresale) / NULLIF(cash,0)) AS avg_sell_through
    FROM event
    WHERE is_visible = true
      AND date BETWEEN ? AND ?
  `, p)

	/* =====================================================
	   2. REVENUE METRICS
	===================================================== */

	const [[revenue]] = await pool.query(`
    SELECT
      SUM(soldOnPlace * cash + soldPresale * IFNULL(presalePrice,0)) AS gross_revenue,
      AVG(soldOnPlace * cash + soldPresale * IFNULL(presalePrice,0)) AS avg_revenue_per_event,
      SUM(soldOnPlace * cash) AS door_revenue,
      SUM(soldPresale * IFNULL(presalePrice,0)) AS presale_revenue
    FROM event
    WHERE is_visible = true
      AND date BETWEEN ? AND ?
  `, p)

	/* =====================================================
	   3. TIME-BASED METRICS
	===================================================== */

	const [events_by_weekday] = await pool.query(`
    SELECT
      DAYOFWEEK(date) AS weekday,
      COUNT(*) AS events,
      AVG(soldOnPlace + soldPresale + soldGuestList) AS avg_attendance
    FROM event
    WHERE is_visible = true
      AND date BETWEEN ? AND ?
    GROUP BY weekday
  `, p)

	const [seasonality] = await pool.query(`
    SELECT
      MONTH(date) AS month,
      COUNT(*) AS events,
      AVG(soldOnPlace + soldPresale + soldGuestList) AS avg_attendance
    FROM event
    WHERE is_visible = true
      AND date BETWEEN ? AND ?
    GROUP BY month
  `, p)

	/* =====================================================
	   4. BAND PERFORMANCE METRICS
	===================================================== */

	const [band_performance] = await pool.query(`
    SELECT
      b.id,
      b.label,
      COUNT(DISTINCT e.id) AS events_played,
      AVG(e.soldOnPlace + e.soldPresale + e.soldGuestList) AS avg_attendance,
      MAX(bie.stageTime) AS avg_latest_stage_time
    FROM band b
    JOIN band_in_event bie ON bie.id_band = b.id
    JOIN event e ON e.id = bie.id_event
    WHERE e.is_visible = true
      AND e.date BETWEEN ? AND ?
    GROUP BY b.id
    ORDER BY avg_attendance DESC
  `, p)

	/* =====================================================
	   5. TAG-BASED ANALYTICS
	===================================================== */

	const [event_tags] = await pool.query(`
    SELECT
      t.id,
      t.label,
      COUNT(DISTINCT e.id) AS event_count,
      AVG(e.soldOnPlace + e.soldPresale + e.soldGuestList) AS avg_attendance,
      AVG((e.soldOnPlace + e.soldPresale) / NULLIF(e.cash,0)) AS sell_through
    FROM tag t
    JOIN tag_in_event tie ON tie.id_tag = t.id
    JOIN event e ON e.id = tie.id_event
    WHERE e.is_visible = true
      AND e.date BETWEEN ? AND ?
    GROUP BY t.id
  `, p)

	const [band_tags] = await pool.query(`
    SELECT
      t.id,
      t.label,
      AVG(e.soldOnPlace + e.soldPresale + e.soldGuestList) AS avg_attendance
    FROM tag t
    JOIN tag_in_band tib ON tib.id_tag = t.id
    JOIN band_in_event bie ON bie.id_band = tib.id_band
    JOIN event e ON e.id = bie.id_event
    WHERE e.is_visible = true
      AND e.date BETWEEN ? AND ?
    GROUP BY t.id
  `, p)

	/* =====================================================
	   6. BAND ↔ EVENT SYNERGIES
	===================================================== */

	const [band_pairs] = await pool.query(`
    SELECT
      b1.label AS band_a,
      b2.label AS band_b,
      COUNT(DISTINCT e.id) AS shared_events,
      AVG(e.soldOnPlace + e.soldPresale + e.soldGuestList) AS avg_attendance
    FROM band_in_event x
    JOIN band_in_event y
      ON x.id_event = y.id_event AND x.id_band < y.id_band
    JOIN band b1 ON b1.id = x.id_band
    JOIN band b2 ON b2.id = y.id_band
    JOIN event e ON e.id = x.id_event
    WHERE e.is_visible = true
      AND e.date BETWEEN ? AND ?
    GROUP BY band_a, band_b
    HAVING shared_events >= 2
  `, p)

	/* =====================================================
	   7. MARKETING & CONVERSION
	===================================================== */

	const [[marketing]] = await pool.query(`
    SELECT
      AVG(CASE WHEN fbEvent IS NOT NULL THEN soldPresale END) AS presale_with_fb,
      AVG(CASE WHEN fbEvent IS NULL THEN soldPresale END) AS presale_without_fb,
      AVG(CASE WHEN tickets IS NOT NULL THEN soldPresale END) AS presale_with_ticket_link,
      AVG(CASE WHEN youtube IS NOT NULL THEN soldPresale END) AS presale_with_youtube
    FROM event
    WHERE is_visible = true
      AND date BETWEEN ? AND ?
  `, p)

	/* =====================================================
	   8. OPERATIONAL / CURATION METRICS
	===================================================== */

	const [low_attendance_events] = await pool.query(`
    SELECT
      id,
      label,
      date,
      (soldOnPlace + soldPresale) / NULLIF(cash,0) AS sell_through
    FROM event
    WHERE is_visible = true
      AND date BETWEEN ? AND ?
      AND (soldOnPlace + soldPresale) / NULLIF(cash,0) < 0.4
    ORDER BY sell_through ASC
  `, p)

	const [repeat_bands] = await pool.query(`
    SELECT
      b.label,
      COUNT(DISTINCT e.id) AS appearances
    FROM band b
    JOIN band_in_event bie ON bie.id_band = b.id
    JOIN event e ON e.id = bie.id_event
    WHERE e.is_visible = true
      AND e.date BETWEEN ? AND ?
    GROUP BY b.id
    HAVING appearances > 1
  `, p)

	/* =====================================================
	   9. USER / PRIVILEGE METRICS
	===================================================== */

	const [privileges] = await pool.query(`
    SELECT
      p.label,
      COUNT(up.id_user) AS users_with_privilege,
      SUM(up.active = true) AS active_assignments
    FROM privilege p
    LEFT JOIN user_privilege up ON up.id_privilege = p.id
    GROUP BY p.id
  `)

	/* =====================================================
	   10. COMPOSITE METRICS
	===================================================== */

	const [[composite]] = await pool.query(`
    SELECT
      AVG(
        (soldOnPlace + soldPresale) / NULLIF(cash,0) * 0.4 +
        soldPresale / NULLIF(soldPresale + soldOnPlace,0) * 0.3
      ) AS avg_event_success_score
    FROM event
    WHERE is_visible = true
      AND date BETWEEN ? AND ?
  `, p)

	/* =====================================================
	   RESPONSE
	===================================================== */

	return json({
		event_performance,
		revenue,
		time: {
			by_weekday: events_by_weekday,
			seasonality
		},
		bands: {
			performance: band_performance,
			synergies: band_pairs
		},
		tags: {
			event_tags,
			band_tags
		},
		marketing,
		operations: {
			low_attendance_events,
			repeat_bands
		},
		users: {
			privileges
		},
		composite
	})
}
