<script>
	export let data;
	import Card from '$lib/Card.svelte';
	import { onMount } from 'svelte';
	import { getHomepageSeo } from '$lib/seo/homepageSeoBuilder.js';

	const closest = data.closest;
	const future = data.future;
	const older = data.older;

	onMount(() => {
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.innerHTML = JSON.stringify(getHomepageSeo(closest, future, older), null, 2);
		document.head.appendChild(script);
	});
</script>

<svelte:head>
	<title>Program v Žižkárně</title>
	<meta
		name="description"
		content="Aktuální program v Žižkárně na měsíce dopředu s historií uplynulých akcí. S pravidelným navštěvováním programu Ti už nikdy akce/koncert/trh/workshop/divadlo neuteče! Jsme nový kulturně-kreativní prostor v Českých Budějovických pro všechny generace. Snažíme se oživit areál bývalých Žižkových kasáren a nabídnout občanům Českých Budějovic místo pro setkávání, zábavu a kreativitu. Jsme otevření všem umělcům a kreativcům."
	/>
</svelte:head>

<div class="my-5">
	<h1 id="closest" class="neue-bold display-3">// Nejbližší akce</h1>
	{#if closest === null || closest.length < 1}
		<p class="neue lead text-center my-5 py-5">Zatím žádné akce :/</p>
	{:else}
		{#each closest as event}
			<Card {event} />
			<hr class="border-2 mx-5" />
		{/each}
	{/if}
	<h1 id="future" class="neue-bold display-3">// Na co se můžete těšit</h1>
	{#if future === null || future.length < 1}
		<p class="neue lead text-center my-5 py-5">Zatím žádné akce :/</p>
	{:else}
		{#each future as event}
			<Card {event} />
			<hr class="border-2 mx-5" />
		{/each}
	{/if}
	<h1 id="older" class="neue-bold display-3">// Uplynulé akce</h1>
	{#if older === null || older.length < 1}
		<p class="neue lead text-center my-5 py-5">Zatím žádné akce :/</p>
	{:else}
		{#each older as event}
			<Card {event} isPast={true} />
			<hr class="border-2 mx-5" />
		{/each}
	{/if}
</div>
