<script>
	import { onMount, tick } from 'svelte';

	let date_from = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);
	let date_to = new Date().toISOString().slice(0, 10);

	let loading = false;
	let error = null;
	let data = null;

	async function load() {
		loading = true;
		error = null;
		try {
			const res = await fetch(`/api/osa/getAll?date_from=${date_from}&date_to=${date_to}`);
			if (!res.ok) throw new Error(await res.text());
			data = await res.json();
			await tick();

			console.log(data);
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	onMount(load);

	function addFakeSales(events) {
		return events.map((e) => ({
			...e,
			soldOnPlace: e.soldOnPlace ?? randomBetween(20, 60),
			soldPresale: e.presalePrice != null ? (e.soldPresale ?? randomBetween(0, 20)) : 0,
			soldGuestList: e.soldGuestList ?? randomBetween(0, 5)
		}));
	}

	function randomBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	$: displayEvents = data?.events ? addFakeSales(data.events) : [];

	function exportPDF() {
		window.print();
	}
</script>

<h1>OSA</h1>
<a href="/admin">zpět</a><br />

<section class="filters">
	<label>From <input type="date" bind:value={date_from} /></label>
	<label>To <input type="date" bind:value={date_to} /></label>
	<button on:click={load} disabled={loading}>Reload</button>
	<button on:click={exportPDF}>Export PDF</button>
</section>

{#if loading}
	<p>Loading…</p>
{:else if error}
	<p class="error">{error}</p>
{:else if data}
	<div class="events">
		{#each displayEvents as e}
			<div class="event">
				<h2>{e.label}</h2>

				<p>
					{new Date(e.date).toLocaleDateString('cs-CZ', {
						month: 'numeric',
						day: 'numeric',
						weekday: 'long'
					})}
				</p>
				<p><b>Vstupné (na místě):</b> {e.price_on_site}</p>
				<p><b>Předprodej:</b> {e.presalePrice ?? '—'}</p>

				<p><b>Prodáno na místě:</b> {e.soldOnPlace ?? 0}</p>
				<p><b>Prodáno v předprodeji:</b> {e.soldPresale ?? 0}</p>
				<p><b>Guestlist:</b> {e.soldGuestList ?? 0}</p>
				<p>
					<b>Celkem:</b>
					{(e.soldOnPlace ?? 0) + (e.soldPresale ?? 0) + (e.soldGuestList ?? 0)}
				</p>

				<p>
					<b>Kapely/Pořadatelé:</b>
					{e.bands ?? '—'}
				</p>
			</div>
		{/each}
	</div>
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

	.events {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.event {
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	@media print {
		button,
		.filters,
		a {
			display: none !important;
		}

		:global(body) {
			background: white !important;
			color: black !important;
		}

		.event {
			break-inside: avoid;
			page-break-inside: avoid;
		}
	}
</style>
