<script>
	export let data;

	const today = new Date();

	function dateColor(date) {
		const eventDate = new Date(date);
		eventDate.setDate(new Date(date).getDate() + 1);
		return eventDate < today ? 'darkred' : 'darkgreen';
	}
</script>

<h1>seznam událostí</h1>
<a href="/admin">zpět</a><br />
<a href="/admin/events/add">vytvořit</a>
<table class="admin-table">
	{#each data.events as event}
		<tr>
			<td>
				<b>{event.id}</b>
			</td>
			<td style="background: {dateColor(event.date)}">
				{new Date(event.date).toLocaleDateString('cs-CZ', {})}
			</td>
			<td>
				<span style="color:{event.is_visible ? 'green' : 'red'}">&block;</span>
			</td>
			<td>
				{#if event.fbEvent != null}
					<a href={event.fbEvent} style="color:green" target="_blank">FB</a>
				{:else}
					<span style="color:red"><b>FB</b></span>
				{/if}
			</td>
			<td>
				<a href="/{event.id}">prog</a>
			</td>
			<td>
				{event.label}
			</td>
			<td>
				<a href="/admin/events/edit/{event.id}">upravit</a>
			</td>
			<td>
				<a href="/admin/events/copy/{event.id}">copy</a>
			</td>
			<td>
				<a href="/admin/events/video/{event.id}">video</a>
			</td>
		</tr>
	{/each}
</table>
