<script>
	export var event;
	export var disabled = false;

	import { onMount } from 'svelte';
	import ShareButton from '$lib/buttons/ShareButton.svelte';
	import AddToCalButtons from '$lib/buttons/AddToCalButtons.svelte';
	import TicketsButton from '$lib/buttons/TicketsButton.svelte';
	import FacebookEventButton from '$lib/buttons/FacebookEventButton.svelte';
	import DoorsText from '$lib/DoorsText.svelte';
	import CashText from '$lib/CashText.svelte';
	import DateText from '$lib/DateText.svelte';
	import TagsBuilder from '$lib/TagsBuilder.svelte';
	import LazyImage from '$lib/LazyImage.svelte';
	import AnalyticsButtonWrapper from './buttons/AnalyticsButtonWrapper.svelte';

	const showDetail = () => (window.location = '/' + event.id);

	const imagePath = `/dynamic/events/${event.id}.jpg`;
	let imageExists = false;

	const checkImageExists = async () => {
		const response = await fetch(imagePath, { method: 'HEAD' });
		imageExists = response.ok;
	};

	onMount(checkImageExists);
</script>

<div class="row d-flex justify-content-center mx-0 mx-md-5 px-3 px-md-5">
	<AnalyticsButtonWrapper
		classes={'col-12 col-md-6'}
		on:click={showDetail}
		event="detail-from-image"
		data={{ eventLabel: event.label }}
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
	</AnalyticsButtonWrapper>
	<div class="col-12 col-md-6">
		<a style="text-decoration:none; color:var(--bs-heading-color);" href="/{event.id}">
			<h1 class="mt-3 mt-md-0 neue-bold">
				{event.label}
			</h1>
		</a>
		<TagsBuilder tags={event.tags} isHomepageCard={true} />
		<hr class="border-2" />
		<DateText date={event.date} />
		<CashText cash={event.cash} presale={event.presalePrice} />
		<DoorsText doors={event.doors} />
		<hr class="border-2" />
		<AnalyticsButtonWrapper event="detail-from-button" data={{ eventLabel: event.label }}>
			<a href="/{event.id}" class="btn btn-outline-info karla mt-1">
				<i class="bi bi-info-circle-fill pe-2" />Detaily akce
			</a>
		</AnalyticsButtonWrapper>
		<FacebookEventButton fbEvent={event.fbEvent} label={event.label} card={true} />
		<TicketsButton tickets={event.tickets} label={event.label} card={true} />
		<ShareButton urlSuffix={event.id} label={event.label} past={disabled} card={true} />
		{#if !disabled}
			<AddToCalButtons label={event.label} date={event.date} doors={event.doors} card={true} />
		{/if}
	</div>
</div>
