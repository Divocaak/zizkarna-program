<script>
	export var event;
	export var disabled = false;

	import ShareButton from '$lib/ShareButton.svelte';
	import AddToCalButtons from '$lib/AddToCalButtons.svelte';
	import TicketsButton from '$lib/TicketsButton.svelte';
	import FacebookEventButton from '$lib/FacebookEventButton.svelte';
	import DoorsText from '$lib/DoorsText.svelte';
	import CashText from '$lib/CashText.svelte';
	import DateText from '$lib/DateText.svelte';
	import TagsBuilder from '$lib/TagsBuilder.svelte';

	import { onMount } from 'svelte';
	var url = '';
	onMount(() => (url = window.location.origin));

	const handleImageError = (ev) => (ev.target.src = '/placeholder.jpg');
</script>

<div class="row d-flex justify-content-center mx-md-5 px-3 px-md-5">
	<div class="col-12 col-md-6">
		<img
			class="img-fluid border border-dark border-3"
			class:disabled
			src="{url}/dynamic/events/{event.id}.jpg"
			alt="event thumbnail"
			on:error={handleImageError}
		/>
	</div>
	<div class="col-12 col-md-6">
		<h1 class="mt-3 mt-md-0 neue-bold">{event.eventLabel}</h1>
		<TagsBuilder tags={event.tags} />
		<hr class="border-2" />
		<DateText date={event.date} />
		<CashText cash={event.cash} />
		<DoorsText doors={event.doors} />
		<hr class="border-2" />
		<a href="/{event.id}" class="btn btn-outline-info neue"
			><i class="bi bi-info-circle pe-2" />Chci víc</a
		>
		<FacebookEventButton fbEvent={event.fbEvent} />
		<TicketsButton tickets={event.tickets} />
		<ShareButton urlSuffix={event.id} label={event.eventLabel} />
		<AddToCalButtons label={event.eventLabel} date={event.date} doors={event.doors} />
	</div>
</div>

<style>
	@keyframes -global-from-left {
		0% {
			transform: rotateX(50deg) translateX(-150vw) skewX(-50deg);
			opacity: 1;
		}
		100% {
			transform: rotateX(0deg) translateX(0) skewX(0deg);
			opacity: 1;
		}
	}

	.disabled {
		filter: saturate(0%);
	}
</style>
