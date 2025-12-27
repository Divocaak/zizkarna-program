<script>
	import { onMount } from 'svelte';
	import {
		Chart,
		RadarController,
		RadialLinearScale,
		PointElement,
		LineElement,
		Tooltip,
		Legend
	} from 'chart.js';
	export let labels = [];
	export let datasets = [];
	export let title = '';

	let canvas;
	let chart;

	Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

	onMount(() => {
		if (!labels.length || !datasets.length) return;

		chart = new Chart(canvas, {
			type: 'radar',
			data: { labels, datasets },
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'top' },
					title: { display: !!title, text: title }
				},
				scales: { r: { beginAtZero: true, max: 100 } } // normalize to 0-100
			}
		});

		return () => chart.destroy();
	});

	$: if (chart) {
		chart.data.labels = labels;
		chart.data.datasets = datasets;
		chart.update();
	}
</script>

<canvas bind:this={canvas}></canvas>
