<script>
	import { onMount, tick } from 'svelte';
	import BarChart from '$lib/admin/analytics/charts/BarChart.svelte';
	import LineChart from '$lib/admin/analytics/charts/LineChart.svelte';
	import ScatterChart from '$lib/admin/analytics/charts/ScatterChart.svelte';
	import RadarChart from '$lib/admin/analytics/charts/RadarChart.svelte';
	import Gauge from '$lib/admin/analytics/Gauge.svelte';

	let date_from = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);
	let date_to = new Date().toISOString().slice(0, 10);

	let loading = false;
	let error = null;
	let data = null;

	let sortKey = 'sell_through';
	let asc = true;

	$: sorted = data?.operations?.low_attendance_events
		? [...data.operations.low_attendance_events].sort((a, b) =>
				asc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
			)
		: [];

	async function load() {
		loading = true;
		error = null;
		try {
			const res = await fetch(`/api/analytics/getAll?date_from=${date_from}&date_to=${date_to}`);
			if (!res.ok) throw new Error(await res.text());
			data = await res.json();
			await tick();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	onMount(load);

	// Radar normalization
	const radarLabels = ['Attendance', 'Presale', 'Sell-through'];
	$: radarDatasets = data?.bands?.performance
		? (() => {
				const maxAttendance = Math.max(...data.bands.performance.map((b) => b.avg_attendance), 1);
				return data.bands.performance.slice(0, 5).map((b, i) => ({
					label: b.label,
					data: [
						Math.round((b.avg_attendance / maxAttendance) * 100),
						Math.round(data.event_performance.avg_presale_ratio * 100),
						Math.round(data.event_performance.avg_sell_through * 100)
					],
					fill: true,
					backgroundColor: 'rgba(0,123,255,0.2)',
					borderColor: 'rgba(0,123,255,0.8)',
					pointBackgroundColor: 'rgba(0,123,255,1)'
				}));
			})()
		: [];

	import {
		Chart,
		Tooltip,
		Legend,
		CategoryScale,
		LinearScale,
		BarController,
		BarElement,
		LineController,
		LineElement,
		PointElement,
		RadarController,
		RadialLinearScale,
		ScatterController
	} from 'chart.js';

	// Register controllers & elements you need
	Chart.register(
		BarController,
		BarElement,
		LineController,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		RadarController,
		RadialLinearScale,
		ScatterController,
		Tooltip,
		Legend
	);
</script>

<h1>Analytics Dashboard</h1>
<a href="/admin">zpět</a><br />
<a href="/admin/analytics/list">eventy</a>

<section class="filters">
	<label>From <input type="date" bind:value={date_from} /></label>
	<label>To <input type="date" bind:value={date_to} /></label>
	<button on:click={load} disabled={loading}>Reload</button>
</section>

{#if loading}
	<p>Loading…</p>
{:else if error}
	<p class="error">{error}</p>
{:else if data}
	<table>
		<thead>
			<tr>
				<th>Event</th>
				<th>Date</th>
				<th
					on:click={() => {
						sortKey = 'sell_through';
						asc = !asc;
					}}>Sell-through</th
				>
			</tr>
		</thead>
		<tbody>
			{#each sorted as e}
				<tr>
					<td>{e.label}</td>
					<td>{e.date}</td>
					<td>{(e.sell_through * 100).toFixed(1)}%</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<section>
		<h2>Events by Weekday</h2>
		<BarChart
			labels={data.time.by_weekday.map((r) => r.weekday)}
			datasets={[
				{
					label: 'Events',
					data: data.time.by_weekday.map((r) => r.events),
					backgroundColor: 'rgba(0,123,255,0.7)'
				}
			]}
		/>
	</section>

	<section>
		<h2>Seasonality</h2>
		<LineChart
			labels={data.time.seasonality.map((r) => r.month)}
			datasets={[
				{
					label: 'Avg attendance',
					data: data.time.seasonality.map((r) => Math.round(r.avg_attendance)),
					borderColor: 'rgba(0,255,123,0.8)',
					backgroundColor: 'rgba(0,255,123,0.3)',
					tension: 0.3
				}
			]}
		/>
	</section>

	<section>
		<h2>Revenue</h2>
		<BarChart
			labels={['Door', 'Presale']}
			datasets={[
				{
					label: 'Revenue',
					data: [data.revenue.door_revenue, data.revenue.presale_revenue],
					backgroundColor: 'rgba(0,123,255,0.7)'
				}
			]}
		/>
	</section>

	<section>
		<h2>Top Bands</h2>
		<BarChart
			labels={data.bands.performance.map((b) => b.label)}
			datasets={[
				{
					label: 'Avg attendance',
					data: data.bands.performance.map((b) => Math.round(b.avg_attendance)),
					backgroundColor: 'rgba(0,123,255,0.7)'
				}
			]}
		/>
	</section>

	<section>
		<h2>Event Tags</h2>
		<BarChart
			labels={data.tags.event_tags.map((t) => t.label)}
			datasets={[
				{
					label: 'Avg attendance',
					data: data.tags.event_tags.map((t) => Math.round(t.avg_attendance)),
					backgroundColor: 'rgba(0,123,255,0.7)'
				}
			]}
		/>
	</section>

	<section>
		<h2>Marketing Impact</h2>
		<BarChart
			labels={['FB', 'No FB', 'Ticket', 'YouTube']}
			datasets={[
				{
					label: 'Avg presale',
					data: [
						data.marketing.presale_with_fb,
						data.marketing.presale_without_fb,
						data.marketing.presale_with_ticket_link,
						data.marketing.presale_with_youtube
					],
					backgroundColor: 'rgba(0,123,255,0.7)'
				}
			]}
		/>
	</section>

	<section>
		<h2>Repeat Bands</h2>
		<BarChart
			labels={data.operations.repeat_bands.map((b) => b.label)}
			datasets={[
				{
					label: 'Appearances',
					data: data.operations.repeat_bands.map((b) => b.appearances),
					backgroundColor: 'rgba(0,123,255,0.7)'
				}
			]}
		/>
	</section>

	<section>
		<h2>Low Attendance Events</h2>
		<ScatterChart
			title="Low Attendance Events"
			dataPoints={data.operations.low_attendance_events.map((e) => ({
				x: e.sell_through,
				y: e.attendance,
				event: e
			}))}
		/>
	</section>

	<section>
		<h2>Top Bands Radar</h2>
		<RadarChart labels={radarLabels} datasets={radarDatasets} />
	</section>

	<section>
		<h2>Privileges</h2>
		<table>
			<thead>
				<tr>
					<th>Privilege</th>
					<th>Users</th>
					<th>Active</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users.privileges as p}
					<tr>
						<td>{p.label}</td>
						<td>{p.users_with_privilege}</td>
						<td>{p.active_assignments}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<section>
		<h2>Composite Event Success</h2>
		<Gauge value={data.composite.avg_event_success_score} />
	</section>
{/if}

<style>
	section {
		margin: 2rem 0;
	}
	.filters {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
	}
	.error {
		color: red;
	}
	table {
		border-collapse: collapse;
		width: 100%;
	}
	th,
	td {
		border: 1px solid #ccc;
		padding: 0.5rem;
		text-align: center;
	}
	th {
		cursor: pointer;
	}
</style>
