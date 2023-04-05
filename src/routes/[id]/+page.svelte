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

	import tags from '$lib/content/tags.json';

	export let data;
	let event = data.event;
</script>

<div
	class="bg-img"
	style="background-image: url('/imgs/{event.thumbnail != null
		? event.thumbnail
		: 'placeholder.png'}');"
/>
<div class="content bg-light text-center py-5 mx-5 px-5 border border-dark border-5">
	<div class="back-arrow">
		<!-- svelte-ignore a11y-missing-content -->
		<a href="/" class="btn btn-close" />
	</div>
	<h1 class="display-1 neue-bold">{event.label}</h1>
	<div style="font-size:1.3rem">
		<TagsBuilder tagsBank={tags} actualTags={event.tags} />
	</div>
	<div class="row my-5" style="font-size:1.2rem">
		<div class="col-4">
			<DateText date={event.date} />
		</div>
		<div class="col-4">
			<CashText cash={event.cash} />š
		</div>
		<div class="col-4">
			<DoorsText doors={event.doors} />
		</div>
		<div class="col-6">
			<FacebookEventButton fbEvent={event.fbEvent} />
			<TicketsButton tickets={event.tickets} />
			<ShareButton label={event.label} />
		</div>
		<div class="col">
			<AddToCalButtons {event} />
		</div>
	</div>
	{#each event.bands as band}
		<h2 class="display-2 neue mt-5 pt-5">{band.label}</h2>
		<p class="neue">{band.desc}</p>
		{#each band.links as link}
			<BandLinkButton link={link.link} label={link.label} type={link.type} />
		{/each}
		<div class="row justify-content-center mt-4">
			{#each band.imgs as path}
				<div class="col-4">
					<img src="/imgs/{path}" alt={path} class="img-fluid d-inline-block" />
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
