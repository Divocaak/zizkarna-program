<script>
	import { writable } from 'svelte/store';
	export let data;

	const isLoading = writable(false);

	const event = data.event;
	const eventTags = data.eventTags;
	const bands = data.bands ?? [];

	async function sendData(selectedBand) {
		try {
			isLoading.set(true);

			const response = await fetch('/api/videoGenerator', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ event: event, eventTags: eventTags, band: selectedBand })
			});
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isLoading.set(false);
		}
	}
</script>

<a href="/admin/events">zpět</a><br /><br />
{#each bands as band}
	<button on:click={() => sendData(band)}>{band.label}</button><br />
{/each}<br>

{#if $isLoading}
	vytvářím video..
{:else}
	<!-- svelte-ignore a11y-media-has-caption -->
	<video width="342" height="607" autoplay loop>
		<source src="/dynamic/generator/video.mp4" type="video/mp4" />
	</video>
{/if}

<style>
	video {
		border: 2px solid red;
	}
</style>
