<script>
	import { onMount } from 'svelte';
	import AddToCalButtons from '$lib/buttons/AddToCalButtons.svelte';
	import CashText from '$lib/CashText.svelte';
	import DateText from '$lib/DateText.svelte';
	import DoorsText from '$lib/DoorsText.svelte';
	import FacebookEventButton from '$lib/buttons/FacebookEventButton.svelte';
	import ShareButton from '$lib/buttons/ShareButton.svelte';
	import TicketsButton from '$lib/buttons/TicketsButton.svelte';
	import BandLinkButton from '$lib/buttons/BandLinkButton.svelte';
	import TagsBuilder from '$lib/TagsBuilder.svelte';
	import BandImageBuilder from '$lib/BandImageBuilder.svelte';

	export let data;
	const event = data.event;
	const bands = data.bands ?? [];

	function timeFormat(time) {
		return time.substring(0, time.length - 3);
	}

	import eventSeo from '$lib/seo/event.json';
	import bandSeo from '$lib/seo/band.json';

	eventSeo.name = event.label;
	eventSeo.startDate = event.date;
	eventSeo.description = event.description;
	eventSeo.url = 'https://program.zizkarna.cz/' + event.id;
	eventSeo.doorTime = event.doors;
	eventSeo.image = 'https://program.zizkarna.cz/dynamic/events/' + event.id + '.jpg';
	eventSeo.isAccessibleForFree = event.cash == 0;

	let keywordsToDesc = "";
	eventSeo.keywords = [];
	data.eventTags.forEach((tag) => {
		const tagName = getTagName(tag.label).toLowerCase();
		eventSeo.keywords.push(tagName);
		keywordsToDesc += (tagName + ", ");
	});

	eventSeo.performer = [];
	bands.forEach((band) => {
		let currBandSeo = { ...bandSeo };
		currBandSeo.name = band.label;
		currBandSeo.description = band.description;
		currBandSeo.performTime = band.stageTime;

		currBandSeo.genre = [];
		band.tags.forEach((tag) => {
			currBandSeo.genre.push(getTagName(tag.label).toLowerCase());
			eventSeo.keywords.push(getTagName(tag.label).toLowerCase());
		});

		currBandSeo.sameAs = band.links;
		eventSeo.performer.push(currBandSeo);
	});

	eventSeo.offers = [
		{
			'@type': 'Offer',
			price: event.cash.toString(),
			priceCurrency: 'CZK'
		}
	];

	if (event.tickets != '' && event.presalePrice != null) {
		eventSeo.offers.push({
			'@type': 'Offer',
			price: event.presalePrice.toString(),
			priceCurrency: 'CZK',
			url: event.tickets
		});
	}

	onMount(() => {
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.innerHTML = JSON.stringify(eventSeo, null, 2);
		document.head.appendChild(script);
	});

	function getTagName(tag) {
		const match = tag.match(/^\/\/ (.+?) \/\/$/);
		return match ? match[1] : '';
	}
</script>

<svelte:head>
	<title>{event.label}</title>
	<meta
		name="description"
		content="Zajímá tě detail akce {event.label}? Na této stránce najdeš odkazy na jedtliové kapely, představující text a spoustu dalšího"
	/>
	<meta
		name="keywords"
		content="{keywordsToDesc.slice(0,-2)}"
	/>
</svelte:head>

<div
	class="bg-img"
	style="background-image: url('/dynamic/events/{event.id}.jpg'), url('/placeholder.jpg');"
/>
<div class="content bg-light py-5 mx-1 mx-md-5 px-4 px-md-5 border border-dark border-5">
	<div class="back-arrow">
		<!-- svelte-ignore a11y-missing-content -->
		<a href="/" class="btn btn-close" />
	</div>
	<h1 class="display-1 neue-bold">{event.label}</h1>
	<div class="text-center" style="font-size:1.3rem">
		<TagsBuilder tags={data.eventTags} />
	</div>
	<div class="row my-5 text-center" style="font-size:1.2rem">
		<div class="col-12 col-md-4">
			<DateText date={event.date} />
		</div>
		<div class="col-12 col-md-4">
			<CashText cash={event.cash} presale={event.presalePrice} />
		</div>
		<div class="col-12 col-md-4">
			<DoorsText doors={event.doors} />
		</div>
	</div>
	<div class="row my-5 text-center" style="font-size:1.2rem">
		<div class="col-12 col-md-6">
			<FacebookEventButton fbEvent={event.fbEvent} label={event.label} />
			<TicketsButton tickets={event.tickets} label={event.label} />
			<ShareButton label={event.label} />
		</div>
		<div class="mt-3 mt-md-0 col-12 col-md-6">
			<AddToCalButtons label={event.label} date={event.date} doors={event.doors} />
		</div>
	</div>
	{#if event.description != null}
		<p class="karla">
			{event.description}
		</p>
	{/if}
	{#each bands as band}
		<h2 class="display-2 text-center neue mt-0 mt-md-5 pt-0 pt-md-5">{band.label}</h2>
		<div class="text-center mb-3" style="font-size:1.1rem"><TagsBuilder tags={band.tags} /></div>
		<p class="karla">{band.description}</p>
		<p class="text-center karla">Stage time: <b>{timeFormat(band.stageTime)}</b></p>
		<div class="text-center">
			{#each band.links as link}
				<BandLinkButton {link} eventLabel={event.label} bandName={band.label} />
			{/each}
		</div>
		<BandImageBuilder imgs={band.imgs} id={band.id} bandName={band.label} />
	{/each}
	<h2 class="display-3 text-center neue mt-0 mt-md-5 pt-0 pt-md-5">Časový harmonogram</h2>
	<div class="karla">
		<div class="mx-auto centered-div my-5" style="font-size: 1.2rem;">
			<p><b>{timeFormat(event.doors)}</b><i class="bi bi-door-open px-2" />Otevření Žižkárny</p>
			{#each bands as band}
				<p><b>{timeFormat(band.stageTime)}</b> {band.label}</p>
			{/each}
		</div>
		<p class="text-center">
			Dovolujeme si upozornit, že časy jsou pouze orientační a mohou se změnit
		</p>
	</div>
</div>

<style>
	.centered-div {
		width: fit-content;
		margin: 0 auto;
	}

	.back-arrow {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 2;
	}

	.bg-img {
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		position: fixed;
		height: 100vh;
		width: 100vw;
	}

	.content {
		position: relative;
		top: 70vh;
		min-height: 100vh;
	}
</style>
