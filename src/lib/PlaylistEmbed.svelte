<script>
	import AnalyticsButtonWrapper from '$lib/buttons/AnalyticsButtonWrapper.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {string} [title]
	 * @property {string} [src]
	 */

	/** @type {Props} */
	let { title = 'Youtube Playlist', src = '' } = $props();
</script>

<AnalyticsButtonWrapper classes={"col-12 col-md-6"} event={'zztv-playlist'} data={{ playlistTitle: title, src: src }} youtubePlaylist={true}>
	<iframe
		{src}
		{title}
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		frameborder="0"
		allowfullscreen
	></iframe>
</AnalyticsButtonWrapper>

<style>
	iframe{
		position: relative;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
	}
</style>