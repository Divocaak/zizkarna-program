<script>
	export let data;
	import Card from '$lib/Card.svelte';

	var closest = data.events.closest.slice(0, 3);
	var future = data.events.closest.slice(3, data.events.closest.length);

</script>

<div class="my-5">
	<h1 id="closest" class="neue-bold display-3">// Nejbližší akce</h1>
	{#if data.events.closest.length == 0}
		<p class="neue lead text-center my-5 py-5">Zatím žádné akce :/</p>
	{:else}
		{#each closest as event}
			<Card {event} />
			<hr class="border-2 mx-5" />
		{/each}
		<h1 id="future" class="neue-bold display-3">// Na co se můžete těšit</h1>
		{#each future as event}
			<Card {event} />
			<hr class="border-2 mx-5" />
		{/each}
	{/if}
	<h1 id="older" class="neue-bold display-3">// Uplynulé akce</h1>
	{#if data.events.older.length == 0}
		<p class="neue lead text-center my-5 py-5">Zatím žádné akce :/</p>
	{:else}
		{#each data.events.older as event}
			<Card {event} disabled={true}/>
			<hr class="border-2 mx-5" />
		{/each}
	{/if}
</div>
