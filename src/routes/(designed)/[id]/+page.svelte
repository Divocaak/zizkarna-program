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

	export let data;
	let event = data.event;
	let bands = [];
	if (data.bands !== undefined) {
		bands = data.bands;
	}
</script>

<svelte:head>
	<title>Program v Žižkárně: {event.eventLabel}</title>
</svelte:head>

<div
	class="bg-img"
	style="background-image: url('/dynamic/events/{event.id}.jpg'), url('/placeholder.jpg');"
/>
<div
	class="content bg-light text-center py-5 mx-1 mx-md-5 px-4 px-md-5 border border-dark border-5"
>
	<div class="back-arrow">
		<!-- svelte-ignore a11y-missing-content -->
		<a href="/" class="btn btn-close" />
	</div>
	<h1 class="display-1 neue-bold">{event.eventLabel}</h1>
	<div style="font-size:1.3rem">
		<TagsBuilder tags={event.tags} />
	</div>
	<div class="row my-5" style="font-size:1.2rem">
		<div class="col-12 col-md-4">
			<DateText date={event.date} />
		</div>
		<div class="col-12 col-md-4">
			<CashText cash={event.cash} />
		</div>
		<div class="col-12 col-md-4">
			<DoorsText doors={event.doors} />
		</div>
		<div class="col-12 col-md-6">
			<FacebookEventButton fbEvent={event.fbEvent} />
			<TicketsButton tickets={event.tickets} />
			<ShareButton label={event.eventLabel} />
		</div>
		<div class="mt-3 mt-md-0 col-12 col-md-6">
			<AddToCalButtons label={event.eventLabel} date={event.date} doors={event.doors} />
		</div>
	</div>
	{#each bands as band}
		<h2 class="display-2 neue mt-0 mt-md-5 pt-0 pt-md-5">{band.label}</h2>
		<p class="neue">{band.description}</p>
		{#each band.links as link}
			<BandLinkButton {link} />
		{/each}
		<div class="row justify-content-center my-4 pb-5">
			{#each band.imgs as path}
				<div class="col-12 col-md-4 mb-1 mb-md-0 mt-2">
					<img
						src="/dynamic/bands/{band.id}/{path}"
						alt={path}
						class="img-fluid d-inline-block"
					/>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
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
