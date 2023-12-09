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

	function showDetail() {
		window.location = '/' + event.id;
	}
</script>

<div class="row d-flex justify-content-center mx-0 mx-md-5 px-3 px-md-5">
	<div
		class="col-12 col-md-6"
		on:click={showDetail}
		on:keyup={showDetail}
		tabindex="0"
		role="button"
	>
		<img
			class="img-fluid border border-dark border-3"
			class:disabled
			src="./dynamic/events/{event.id}.jpg"
			alt="plakát k akci {event.label}"
			onerror="this.src='placeholder.jpg';"
			loading="lazy"
		/>
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
		<CashText cash={event.cash} presale={event.presale} />
		<DoorsText doors={event.doors} />
		<hr class="border-2" />
		<a href="/{event.id}" class="btn btn-outline-info neue">
			<i class="bi bi-info-circle-fill pe-2" />Detaily akce
		</a>
		<FacebookEventButton fbEvent={event.fbEvent} />
		<TicketsButton tickets={event.tickets} />
		<ShareButton urlSuffix={event.id} label={event.label} />
		<AddToCalButtons label={event.label} date={event.date} doors={event.doors}/>
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
