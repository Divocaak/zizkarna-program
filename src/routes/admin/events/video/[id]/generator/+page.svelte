<script>
	import { selectedEventData, selectedBandData } from '$lib/stores/videoStore.js';

	import fs from 'fs';
	import { Canvas, loadImage } from 'canvas';

	let event;
	let band;
	$: {
		event = $selectedEventData;
		band = $selectedBandData;
	}

	export async function load({ fetch }) {
		// Create a new canvas
		const canvas = createCanvas(1280, 720);
		const context = canvas.getContext('2d');

		// Load the image from file
		const response = await fetch('static/placeholder.jpg');
		const buffer = await response.arrayBuffer();
		const logo = await loadImage(buffer);

		// Draw the image to the canvas at x=100 and y=100 with a size of 500x500
		context.drawImage(logo, 100, 100, 500, 500);

		// Write the image to disk as a PNG
		const output = canvas.toBuffer('image/png');
		await fs.writeFile('image.png', output);

		return { imageSrc: 'image.png' }; // Pass the image source to the component
	}

	export let imageSrc;
</script>

<!-- BUG event id from store -->
<a href="/admin/events/video/1">zpět</a><br /><br />

<main>
	<!-- <img {src} alt="Generated Image" /> -->
</main>
