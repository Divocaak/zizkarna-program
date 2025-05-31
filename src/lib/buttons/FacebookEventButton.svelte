<script>
	import AnalyticsButtonWrapper from '$lib/buttons/AnalyticsButtonWrapper.svelte';

	export let fbEvent = null;
	export let label;
	export let card = false;
</script>

<AnalyticsButtonWrapper event="facebook-event" data={{ eventLabel: label }} fromCard={card}>
	<a
		href={fbEvent}
		class="btn btn-outline-primary karla mt-1"
		class:disabled={fbEvent == null}
		target="_blank"
	>
		<i class="pe-2 bi bi-facebook" />FB událost {fbEvent != null ? '' : ' již brzy'}
	</a>
</AnalyticsButtonWrapper>
