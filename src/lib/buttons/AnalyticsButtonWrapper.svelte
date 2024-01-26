<script>
	import { analyticsStore } from '$lib/stores/analyticsStore.js';

    export let event;
    export let data;
    export let fromCard = false;

    const eventName = `zzBtn${fromCard ? "-card" : ""}-${event}`;

	const new_event = {
		id: 'any-random-id',
		data: data,
		event: eventName,
		type: 'event'
	};

	const addEventToAnalytics = () => analyticsStore.update((existing_events) => [...existing_events, new_event]);;
</script>

<button on:click={addEventToAnalytics}>
	<slot />
</button>

<style>
    button{
        background: none;
        border: none;
        padding: 0
    }
</style>
