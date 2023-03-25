<script>
	import content from '$lib/content.json';
	
	var tags = content['tags'];
	var events = content['events'];
</script>

<!-- TODO share btn (on click, find id, scroll to) -->
<!-- TODO add to calendar -->
{#each events as event}
	<h1>{event.label}</h1>
	<p>{event.date}</p>
	<p>{event.cash},-&nbsp;Kč</p>
	<p>{event.doors}</p>
	<a href={event.fbEvent} class="btn btn-outline-primary"><i class="pe-2 bi bi-facebook"></i>událost na Facebooku</a>
	{#if event.tickets != null}
		<a href={event.tickets} class="btn btn-outline-secondary"><i class="pe-2 bi bi-ticket-perforated-fill"></i>Předprodej lístků</a>
	{/if}
	{#each event.tags as tag}
    <!-- color:{tag.textColor}!important; -->
		<span class="badge bg-secondary mx-1" style="background-color:red!important;">{tags[tag].label}</span>
	{/each}
{/each}
