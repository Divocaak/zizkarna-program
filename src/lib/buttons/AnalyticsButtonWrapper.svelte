<script>
	import { analyticsStore } from '$lib/stores/analyticsStore.js';

	const new_event = {
		id: 'any-random-id',
		data: {},
		event: 'zztv-page-opened',
		type: 'event'
	};
	analyticsStore.update((existing_events) => [...existing_events, new_event]);

	const addEventToAnalytics = () => console.log('plsplspsl');
</script>

<div on:click={addEventToAnalytics}>
	<slot />
</div>
