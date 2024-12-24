<script>
	import AnalyticsButtonWrapper from '$lib/buttons/AnalyticsButtonWrapper.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {any} [fbEvent]
	 * @property {any} label
	 * @property {boolean} [card]
	 */

	/** @type {Props} */
	let { fbEvent = null, label, card = false } = $props();
</script>

<AnalyticsButtonWrapper event="facebook-event" data={{eventLabel: label}} fromCard={card}>
	<a
		href={fbEvent}
		class="btn btn-outline-primary karla mt-1"
		class:disabled={fbEvent == null}
		target="_blank"
	>
		<i class="pe-2 bi bi-facebook"></i>FB událost {fbEvent != null ? '' : ' již brzy'}
	</a>
</AnalyticsButtonWrapper>
