<script>
	export let label;
	let text = 'Přijď do Žižkárny na ' + label;

	export let past = false;
	export let card = false;

	import { page } from '$app/stores';
	import AnalyticsButtonWrapper from '$lib/buttons/AnalyticsButtonWrapper.svelte';
	export let urlSuffix = '';
	let url = $page.url.href + urlSuffix;

	export let title = url.split('/').splice(-1)[0];

	let complete = false;

	async function handleClick() {
		try {
			if (navigator.canShare) {
				await navigator.share({ text, url, title });
			} else {
				await navigator.clipboard.writeText(url);
				complete = true;
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<AnalyticsButtonWrapper event="share" data={{ eventLabel: label, eventPast: past }} fromCard={card}>
	<button on:click={handleClick} class="btn btn-outline-secondary mt-1 karla">
		<i class="bi bi-share-fill pe-2" />
		{#if complete}
			<slot name="complete">Odkaz zkopírován</slot>
		{:else}
			<slot>{!past ? 'Pozvat přátele' : 'Ukázat přátelům'}</slot>
		{/if}
	</button>
</AnalyticsButtonWrapper>
