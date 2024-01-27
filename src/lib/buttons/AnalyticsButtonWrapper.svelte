<script>
	import { analyticsStore } from '$lib/stores/analyticsStore.js';

	export let classes = '';
	export let title = '';

	export let event;
	export let data;
	export let fromCard = false;
	export let youtubePlaylist = false;

	export let callback = null;

	const eventName = `zzBtn${fromCard ? '-card' : ''}-${event}`;

	const new_event = {
		id: 'any-random-id',
		data: data,
		event: eventName,
		type: 'event'
	};

	const addEventToAnalytics = function () {
		analyticsStore.update((existing_events) => [...existing_events, new_event]);
		if (callback != null) callback();
	};
</script>

<div
	class={classes}
	class:youtube-playlist={youtubePlaylist}
	on:click={addEventToAnalytics}
	on:keyup={addEventToAnalytics}
	tabindex="0"
	role="button"
	{title}
>
	<slot />
</div>

<style>
	div {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		display: inline-block;
	}

	.youtube-playlist {
		height: 40vh;
	}
</style>
