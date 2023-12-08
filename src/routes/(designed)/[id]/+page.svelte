<script>
	import AddToCalButtons from '$lib/AddToCalButtons.svelte';
	import CashText from '$lib/CashText.svelte';
	import DateText from '$lib/DateText.svelte';
	import DoorsText from '$lib/DoorsText.svelte';
	import FacebookEventButton from '$lib/FacebookEventButton.svelte';
	import ShareButton from '$lib/ShareButton.svelte';
	import TicketsButton from '$lib/TicketsButton.svelte';
	import BandLinkButton from '$lib/BandLinkButton.svelte';
	import TagsBuilder from '$lib/TagsBuilder.svelte';
	import ImageWithPlaceholder from '$lib/ImageWithPlaceholder.svelte';

	export let data;
	const event = data.event;
	const bands = data.bands ?? [];

	function timeFormat(time) {
		return time.substring(0, time.length - 3);
	}
</script>

<svelte:head>
	<title>{event.label}</title>
	<meta
		name="description"
		content="Zajímá tě detail akce {event.label}? Na této stránce najdeš odkazy na jedtlové kapely, představující text a spoustu dalšího"
	/>
</svelte:head>

<div
	class="bg-img"
	style="background-image: url('/dynamic/events/{event.id}.jpg'), url('/placeholder.jpg');"
/>
<div class="content bg-light py-5 mx-1 mx-md-5 px-4 px-md-5 border border-dark border-5">
	<div class="back-arrow">
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
			<CashText cash={event.cash} presale={event.presale} />
		</div>
		<div class="col-12 col-md-4">
			<DoorsText doors={event.doors} />
		</div>
	</div>
	<div class="row my-5 text-center" style="font-size:1.2rem">
		<div class="col-12 col-md-6">
			<FacebookEventButton fbEvent={event.fbEvent} />
			<TicketsButton tickets={event.tickets} />
			<ShareButton label={event.label} />
		</div>
		<div class="mt-3 mt-md-0 col-12 col-md-6">
			<AddToCalButtons label={event.label} date={event.date} doors={event.doors} />
		</div>
	</div>
	{#if event.description != null}
		<p class="neue">
			{event.description}
		</p>
	{/if}
	{#each bands as band}
		<h2 class="display-2 text-center neue mt-0 mt-md-5 pt-0 pt-md-5">{band.label}</h2>
		<div class="text-center" style="font-size:1.1rem"><TagsBuilder tags={band.tags} /></div>
		<p class="neue">{band.description}</p>
		<p class="text-center neue">Stage time: <b>{timeFormat(band.stageTime)}</b></p>
		<div class="text-center">
			{#each band.links as link}
				<BandLinkButton {link} />
			{/each}
		</div>
		<div class="row justify-content-center my-4 pb-5">
			{#each band.imgs as path}
				<div class="col-12 col-md-4 mb-1 mb-md-0 mt-2">
					<ImageWithPlaceholder
						path="/dynamic/bands/{band.id}/{path}"
						alt="fotka {band.label} číslo {path}"
					/>
				</div>
			{/each}
		</div>
	{/each}
	<h2 class="display-4 text-center neue mt-0 mt-md-5 pt-0 pt-md-5">Časový harmonogram</h2>
	<div class="neue">
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
		top: 100vh;
		min-height: 100vh;
	}
</style>
