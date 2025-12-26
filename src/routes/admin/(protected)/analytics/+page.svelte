<script>
	import { onMount, tick } from 'svelte';
	import Chart from 'chart.js/auto';

	let date_from = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);
	let date_to = new Date().toISOString().slice(0, 10);

	let loading = false;
	let error = null;
	let data = null;

	let charts = [];

	function destroyCharts() {
		charts.forEach((c) => c.destroy());
		charts = [];
	}

	async function load() {
		loading = true;
		error = null;

		try {
			const res = await fetch(`/api/analytics/getAll?date_from=${date_from}&date_to=${date_to}`);
			if (!res.ok) throw new Error(await res.text());
			data = await res.json();

			destroyCharts();
			await tick();

			renderWeekdayChart();
			renderSeasonalityChart();
			renderRevenueStackedChart();
			renderBandsChart();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	onMount(load);

	/* =========================
     CHARTS
  ========================= */

	function renderWeekdayChart() {
		const ctx = document.getElementById('weekdayChart');
		if (!ctx) return;

		charts.push(
			new Chart(ctx, {
				type: 'bar',
				data: {
					labels: data.time.by_weekday.map(
						(r) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][r.weekday - 1]
					),
					datasets: [
						{
							label: 'Events',
							data: data.time.by_weekday.map((r) => r.events)
						}
					]
				},
				options: {
					plugins: {
						tooltip: {
							callbacks: {
								label: (ctx) => `Events: ${ctx.raw}`
							}
						}
					}
				}
			})
		);
	}

	function renderSeasonalityChart() {
		const ctx = document.getElementById('seasonalityChart');
		if (!ctx) return;

		charts.push(
			new Chart(ctx, {
				type: 'line',
				data: {
					labels: data.time.seasonality.map((r) => `Month ${r.month}`),
					datasets: [
						{
							label: 'Avg attendance',
							data: data.time.seasonality.map((r) => r.avg_attendance),
							tension: 0.3
						}
					]
				},
				options: {
					plugins: {
						tooltip: {
							callbacks: {
								label: (ctx) => `Avg attendance: ${Math.round(ctx.raw)}`
							}
						}
					}
				}
			})
		);
	}

	function renderRevenueStackedChart() {
		const ctx = document.getElementById('revenueChart');
		if (!ctx) return;

		charts.push(
			new Chart(ctx, {
				type: 'bar',
				data: {
					labels: ['Revenue'],
					datasets: [
						{
							label: 'Door revenue',
							data: [data.revenue.door_revenue]
						},
						{
							label: 'Presale revenue',
							data: [data.revenue.presale_revenue]
						}
					]
				},
				options: {
					responsive: true,
					scales: {
						x: { stacked: true },
						y: { stacked: true }
					},
					plugins: {
						tooltip: {
							callbacks: {
								label: (ctx) => `${ctx.dataset.label}: ${Math.round(ctx.raw)}`
							}
						}
					}
				}
			})
		);
	}

	function renderBandsChart() {
		const ctx = document.getElementById('bandsChart');
		if (!ctx) return;

		const top = data.bands.performance.slice(0, 10);

		charts.push(
			new Chart(ctx, {
				type: 'bar',
				data: {
					labels: top.map((b) => b.label),
					datasets: [
						{
							label: 'Avg attendance',
							data: top.map((b) => b.avg_attendance)
						}
					]
				},
				options: {
					indexAxis: 'y',
					plugins: {
						tooltip: {
							callbacks: {
								label: (ctx) => `Avg attendance: ${Math.round(ctx.raw)}`
							}
						}
					}
				}
			})
		);
	}
</script>

<h1>analytics</h1>
<a href="/admin">zpět</a><br />
<a href="/admin/analytics/list">eventy</a>

<section class="filters">
	<label>
		From
		<input type="date" bind:value={date_from} />
	</label>

	<label>
		To
		<input type="date" bind:value={date_to} />
	</label>

	<button on:click={load} disabled={loading}>Reload</button>
</section>

{#if loading}
	<p>Loading…</p>
{:else if error}
	<p class="error">{error}</p>
{:else if data}
	<section class="kpis">
		<div>Total events: {data.event_performance.total_events}</div>
		<div>Avg attendance: {Math.round(data.event_performance.avg_attendance)}</div>
		<div>Sell-through: {(data.event_performance.avg_sell_through * 100).toFixed(1)} %</div>
	</section>

	<section class="charts">
		<div>
			<h2>Events by weekday</h2>
			<canvas id="weekdayChart"></canvas>
		</div>

		<div>
			<h2>Seasonality</h2>
			<canvas id="seasonalityChart"></canvas>
		</div>

		<div>
			<h2>Revenue breakdown</h2>
			<canvas id="revenueChart"></canvas>
		</div>

		<div>
			<h2>Top bands</h2>
			<canvas id="bandsChart"></canvas>
		</div>
	</section>
{/if}

<style>
	h1 {
		margin-bottom: 1rem;
	}
	.filters {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	.charts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
	}
	.kpis {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
		font-weight: bold;
	}
	.error {
		color: red;
	}
</style>
