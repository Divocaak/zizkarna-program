<script>
	import { analyticsStore } from '$lib/stores/analyticsStore.js';



	/**
	 * @typedef {Object} Props
	 * @property {string} [classes]
	 * @property {string} [title]
	 * @property {any} event
	 * @property {any} data
	 * @property {boolean} [fromCard]
	 * @property {boolean} [youtubePlaylist]
	 * @property {any} [callback]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let {
		classes = '',
		title = '',
		event,
		data,
		fromCard = false,
		youtubePlaylist = false,
		callback = null,
		children
	} = $props();

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
	onclick={addEventToAnalytics}
	onkeyup={addEventToAnalytics}
	tabindex="0"
	role="button"
	{title}
>
	{@render children?.()}
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
