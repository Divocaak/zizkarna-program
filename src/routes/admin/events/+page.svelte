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
				{new Date(event.date).toLocaleDateString('cs-CZ', {})}, {event.doors}
			</td>
			<td>
				<span style="color:{event.is_visible ? 'green' : 'darkred'}">&block;</span>
			</td>
			<td>
				{#if event.fbEvent != null}
					<a href={event.fbEvent} style="color:green" target="_blank">Fcbk</a>
				{:else}
					<span style="color:darkred"><b>Fcbk</b></span>
				{/if}
			</td>
			<td>
				{#if event.tickets != null}
					<a href={event.tickets} style="color:green" target="_blank">Prsl</a>
				{:else}
					<span style="color:darkred"><b>Prsl</b></span>
				{/if}
			</td>
			<td>
				<a href="/{event.id}">prog</a>
			</td>
			<td>
				{event.cash}{#if event.tickets != null}&nbsp;|&nbsp;<span style="color:cyan">{event.presalePrice}</span>{/if}
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
		</tr>
	{/each}
</table>
