<script>
	export let data;
	import Card from '$lib/Card.svelte';

	var closest,
		future,
		older = null;

	if (data.events.older !== []) older = data.events.older;
	if (data.events.closest !== []) {
		closest = data.events.closest.slice(0, 3);
		future = data.events.closest.slice(3, data.events.closest.length);
	}
</script>

<svelte:head>
	<title>Program v Žižkárně</title>
</svelte:head>

<div class="my-5">
	<h1 id="closest" class="neue-bold display-3">// Nejbližší akce</h1>
	{#if closest === null}
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
	{#if older === null}
		<p class="neue lead text-center my-5 py-5">Zatím žádné akce :/</p>
	{:else}
		{#each older as event}
			<Card {event} disabled={true} />
			<hr class="border-2 mx-5" />
		{/each}
	{/if}
</div>
