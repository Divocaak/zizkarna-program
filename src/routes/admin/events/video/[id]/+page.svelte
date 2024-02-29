<script>
	import { writable } from 'svelte/store';
	export let data;

	const isLoading = writable(null);
	const isImage = writable(false);

	const event = data.event;
	const eventTags = data.eventTags;
	const bands = data.bands ?? [];

	let selectedBand = null;
	const handleBandChange = (band) => (selectedBand = band);

	async function sendData(testFrame = null) {
		if (selectedBand === null) return;

		try {
			isLoading.set(true);

			const response = await fetch('/api/videoGenerator', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					event: event,
					eventTags: eventTags,
					band: selectedBand,
					testFrame: testFrame
				})
			});

			const data = await response.json();
			isImage.set(data.img ?? false);
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isLoading.set(false);
		}
	}
</script>

<a href="/admin/events">zpět</a><br /><br />
<form>
	{#each bands as band}
		<input
			bind:group={selectedBand}
			on:change={() => handleBandChange(band)}
			type="radio"
			id={band.id}
			name="selected_band"
			value={band}
		/>
		<label for={band.id}>{band.label}</label><br />
	{/each}<br />
</form>
<button on:click={() => sendData('event')}>test frame <b>event</b> section</button><br />
<button on:click={() => sendData('band')}>test frame <b>band</b> section</button><br />
<!-- <button on:click={() => sendData(band)}>{band.label}</button><br /> -->

<br />
{#if $isLoading}
	generuji...
{:else if $isLoading === null}
	čekám na input
{:else}
	<!-- prettier-ignore -->
	{#if $isImage}
		<img src="/dynamic/generator/testFrame.png" alt="test frame" width="342" height="607"/>
	{:else}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video width="342" height="607" autoplay loop>
			<source src="/dynamic/generator/video.mp4" type="video/mp4" />
		</video><br />
		<a href="/dynamic/generator/video.mp4" target="_blank" download="video.mp4">stáhnout video</a><br />
	{/if}
{/if}

<style>
	video {
		border: 2px solid green;
	}

	img {
		border: 2px solid red;
	}
</style>
