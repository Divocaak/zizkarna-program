<script>
	import AnalyticsButtonWrapper from '$lib/buttons/AnalyticsButtonWrapper.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {any} [tickets]
	 * @property {any} label
	 * @property {boolean} [card]
	 */

	/** @type {Props} */
	let { tickets = null, label, card = false } = $props();
</script>

{#if tickets != null}
	<AnalyticsButtonWrapper event="buy-tickets" data={{eventLabel: label}} fromCard={card}>
		<a href={tickets} class="btn btn-outline-secondary karla mt-1" target="_blank">
			<i class="pe-2 bi bi-ticket-detailed-fill"></i>Předprodej lístků
		</a>
	</AnalyticsButtonWrapper>
{/if}
