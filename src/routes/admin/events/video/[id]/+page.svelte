<script>
	export let data;
	const event = data.event;
	const bands = data.bands ?? [];

	async function sendData(selectedBand) {
		const response = await fetch('/api/videoGenerator', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ event: event, band: selectedBand })
		});

		if (response.ok) {
			console.log('ok');
		} else {
			console.error('Failed to store data on the server');
		}
	}
</script>

<a href="/admin/events">zpět</a><br /><br />
{#each bands as band}
	<button on:click={() => sendData(band)}>{band.label}</button><br />
{/each}

<!-- svelte-ignore a11y-media-has-caption -->
<video width="1080" height="1920" autoplay loop>
	<source src="/dynamic/generator/video.mp4" type="video/mp4" />
</video>

<style>
	video {
		position: absolute;
		top: -70%;
		border: 2px solid red;
		transform: scale(0.3);
	}
</style>
