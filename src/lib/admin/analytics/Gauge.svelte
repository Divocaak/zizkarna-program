<script>
	import { onMount } from 'svelte';
	import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';

	Chart.register(DoughnutController, ArcElement, Tooltip);

	export let value = 0; // expects a value between 0 and 1

	let canvas;
	let chart;

	onMount(() => {
		if (canvas) {
			chart = new Chart(canvas, {
				type: 'doughnut',
				data: {
					labels: ['Completed', 'Remaining'],
					datasets: [
						{
							data: [value * 100, 100 - value * 100],
							backgroundColor: ['#4caf50', '#e0e0e0'],
							hoverBackgroundColor: ['#4caf50', '#e0e0e0'],
							borderWidth: 0
						}
					]
				},
				options: {
					cutout: '80%',
					rotation: -90,
					circumference: 180,
					plugins: {
						tooltip: { enabled: false }
					}
				}
			});
		}
	});

	$: if (chart) {
		chart.data.datasets[0].data = [value * 100, 100 - value * 100];
		chart.update();
	}
</script>

<div style="position: relative; width: 200px; height: 120px;">
	<canvas bind:this={canvas}></canvas>
	<div
		style="
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -30%);
		font-size: 1.5rem;
		font-weight: bold;
		color: #4caf50;
	"
	>
		{Math.round(value * 100)}%
	</div>
</div>
