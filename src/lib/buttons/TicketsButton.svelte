<script>
	import AnalyticsButtonWrapper from '$lib/buttons/AnalyticsButtonWrapper.svelte';

	export let tickets = null;
	export let label;
	export let card = false;
</script>

{#if tickets != null}
	<AnalyticsButtonWrapper event="buy-tickets" data={{eventLabel: label}} fromCard={card}>
		<a href={tickets} class="btn btn-outline-secondary karla mt-1" target="_blank">
			<i class="pe-2 bi bi-ticket-detailed-fill" />Předprodej lístků
		</a>
	</AnalyticsButtonWrapper>
{/if}
