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
				<a href="/{event.id}">prog</a>
				{#if event.fbEvent != null}(<a href={event.fbEvent} target="_blank">facebook</a
					>){:else}<span style="color:red"><b>FB</b></span>
				{/if}
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
