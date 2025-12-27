<script>
	export let data;

	let id = data.id;
	let onSite = data.onSite ?? 0;
	let presale = data.presale ?? 0;
	let guest = data.guest ?? 0;

	let success;
	let error;
	async function handleSubmit(e) {
		e.preventDefault();

		try {
			const res = await fetch("/api/analytics/update", {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, onSite, presale, guest })
			});

			if (!res.ok) {
				const { message } = await res.json();
				throw new Error(message);
			}

			alert(`Event upraven`);

			success = 'Uloženo';
			error = '';
		} catch (err) {
			error = err.message;
			success = '';
		}
	}
</script>

<h1>upravit event analytics</h1>
<a href="/admin/analytics/list">zpět</a>

<form on:submit={handleSubmit}>
	<label>
		ID (readonly)
		<input type="number" bind:value={id} readonly />
	</label><br />
	<label>
		* na místě
		<input type="number" bind:value={onSite} required />
	</label><br />
	<label>
		* předprodej
		<input type="number" bind:value={presale} required />
	</label><br />
	<label>
		* guestlist
		<input type="number" bind:value={guest} required />
	</label><br />
	{#if error}<p style="color:red">{error}</p>{/if}
	{#if success}<p style="color:green">{success}</p>{/if}
	<button type="submit">Uložit</button>
</form>
