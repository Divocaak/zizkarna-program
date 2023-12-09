<script>
	export let data;
	import Card from '$lib/Card.svelte';
	import { onMount } from 'svelte';

	import homepageSeo from "$lib/seo/homepage.json";
	import eventSeo from '$lib/seo/event.json';

	homepageSeo.itemListElement = [];
	const closest = data.closest;
	closest.forEach(event => getEventJson(event));
	const future = data.future;
	future.forEach(event => getEventJson(event));
	const older = data.older;
	older.forEach(event => getEventJson(event, true));

	onMount(() => {
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.innerHTML = JSON.stringify(homepageSeo, null, 2);
		document.head.appendChild(script);
	});

	function getTagName(tag) {
		const match = tag.match(/^\/\/ (.+?) \/\/$/);
		return match ? match[1] : '';
	}

	function getEventJson(event, past = false) {
		let currEventSeo = { ...eventSeo };
		currEventSeo.name = event.label;
		currEventSeo.startDate = event.date;
		currEventSeo.description = event.description;
		currEventSeo.url = 'https://program.zizkarna.cz/' + event.id;
		currEventSeo.doorTime = event.doors;
		currEventSeo.image = 'https://program.zizkarna.cz/dynamic/events/' + event.id + '.jpg';
		currEventSeo.isAccessibleForFree = event.cash == 0;

		currEventSeo.keywords = [];
		event.tags.forEach((tag) => {
			currEventSeo.keywords.push(getTagName(tag.label).toLowerCase());
		});

		currEventSeo.offers = [
			{
				'@type': 'Offer',
				price: event.cash.toString(),
				priceCurrency: 'CZK'
			}
		];

		if (event.tickets != "" && event.presalePrice != null) {
			currEventSeo.offers.push({
				'@type': 'Offer',
				price: event.presalePrice.toString(),
				priceCurrency: 'CZK',
				url: event.tickets
			});
		}

		currEventSeo.eventStatus = past ? "https://schema.org/EventPostponed" : "https://schema.org/EventScheduled";
		delete currEventSeo.performer;
		homepageSeo.itemListElement.push(currEventSeo);
	}
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
			<Card {event} disabled={true} />
			<hr class="border-2 mx-5" />
		{/each}
	{/if}
</div>
