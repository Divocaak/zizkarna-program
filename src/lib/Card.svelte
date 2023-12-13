<script>
	export var event;
	export var disabled = false;

	import { onMount } from 'svelte';
	import ShareButton from '$lib/ShareButton.svelte';
	import AddToCalButtons from '$lib/AddToCalButtons.svelte';
	import TicketsButton from '$lib/TicketsButton.svelte';
	import FacebookEventButton from '$lib/FacebookEventButton.svelte';
	import DoorsText from '$lib/DoorsText.svelte';
	import CashText from '$lib/CashText.svelte';
	import DateText from '$lib/DateText.svelte';
	import TagsBuilder from '$lib/TagsBuilder.svelte';
	import LazyImage from '$lib/LazyImage.svelte';

	function showDetail() {
		window.location = '/' + event.id;
	}

	const imagePath = `/dynamic/events/${event.id}.jpg`;
	let imageExists = false;

	const checkImageExists = async () => {
		const response = await fetch(imagePath, { method: 'HEAD' });
		imageExists = response.ok;
	};

	onMount(checkImageExists);
</script>

<div class="row d-flex justify-content-center mx-0 mx-md-5 px-3 px-md-5">
	<div
		class="col-12 col-md-6"
		on:click={showDetail}
		on:keyup={showDetail}
		tabindex="0"
		role="button"
	>
		{#if imageExists}
			<LazyImage
				path={imagePath}
				alt="plakát k akci {event.label}"
				additionalClasses="img-fluid border border-dark border-3"
				{disabled}
			/>
		{:else}
			<LazyImage
				path="placeholder.jpg"
				alt="plakát k akci {event.label}"
				additionalClasses="img-fluid border border-dark border-3"
				{disabled}
			/>
		{/if}
	</div>
	<div class="col-12 col-md-6">
		<a style="text-decoration:none; color:var(--bs-heading-color);" href="/{event.id}">
			<h1 class="mt-3 mt-md-0 neue-bold">
				{event.label}
			</h1>
		</a>
		<TagsBuilder tags={event.tags} />
		<hr class="border-2" />
		<DateText date={event.date} />
		<CashText cash={event.cash} presale={event.presalePrice} />
		<DoorsText doors={event.doors} />
		<hr class="border-2" />
		<a href="/{event.id}" class="btn btn-outline-info neue">
			<i class="bi bi-info-circle-fill pe-2" />Detaily akce
		</a>
		<FacebookEventButton fbEvent={event.fbEvent} />
		<TicketsButton tickets={event.tickets} />
		<ShareButton urlSuffix={event.id} label={event.label} />
		<AddToCalButtons label={event.label} date={event.date} doors={event.doors} />
	</div>
</div>
