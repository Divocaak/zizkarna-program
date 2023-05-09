<script>
	export let data;
</script>

<h1>seznam událostí</h1>
<a href="/admin">zpět</a>
<a href="/admin/events/add">vytvořit</a>
<p>
	{#each data.events as event}
		<b>{event.id}</b> | ({new Date(event.date).toLocaleDateString('cs-CZ', {})}) |
		<a href={event.fbEvent} target="_blank">{event.label}</a><br />
	{/each}
</p>
