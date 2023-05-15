<script>
	export let data;
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
			<td>
				{new Date(event.date).toLocaleDateString('cs-CZ', {})}
			</td>
			<td>
				<a href={event.fbEvent} target="_blank">{event.label}</a>
			</td>
			<td>
				<a href="/admin/events/edit/{event.id}">upravit</a>
			</td>
			<td>
				<a href="/{event.id}">zobrazit</a>
			</td>
		</tr>
	{/each}
</table>
