<script>
	import { onMount } from 'svelte';
	import {
		Chart,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend
	} from 'chart.js';

	export let title = '';
	export let labels = [];
	export let datasets = [];

	let canvas;
	let chart;

	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

	onMount(() => {
		if (!labels.length || !datasets.length) return;

		chart = new Chart(canvas, {
			type: 'bar',
			data: { labels, datasets },
			options: {
				responsive: true,
				plugins: { legend: { position: 'top' }, title: { display: !!title, text: title } }
			}
		});

		return () => chart.destroy();
	});

	$: if (chart && labels.length && datasets.length) {
		chart.data.labels = labels;
		chart.data.datasets = datasets;
		chart.update();
	}
</script>

<canvas bind:this={canvas}></canvas>
