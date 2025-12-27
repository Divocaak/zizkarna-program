<script>
	import { onMount } from 'svelte';
	import { Chart, ScatterController, PointElement, LinearScale, Tooltip, Legend } from 'chart.js';

	export let title = '';
	export let dataPoints = []; // [{ x: 0.3, y: 120, event: {...} }]

	let canvas;
	let chart;

	Chart.register(ScatterController, PointElement, LinearScale, Tooltip, Legend);

	onMount(() => {
		if (!dataPoints.length) return;

		chart = new Chart(canvas, {
			type: 'scatter',
			data: {
				datasets: [
					{ label: title || 'Events', data: dataPoints, backgroundColor: 'rgba(255,0,123,0.8)' }
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'top' },
					tooltip: {
						callbacks: {
							label: (ctx) => {
								const e = ctx.raw.event;
								return `${e.label} (${(ctx.raw.x * 100).toFixed(1)}%, ${ctx.raw.y} attendees)`;
							}
						}
					}
				},
				scales: {
					x: {
						min: 0,
						max: 1,
						title: { display: true, text: 'Sell-through' }
					},
					y: {
						title: { display: true, text: 'Attendance' }
					}
				}
			}
		});

		return () => chart.destroy();
	});

	$: if (chart && dataPoints.length) {
		chart.data.datasets[0].data = dataPoints;
		chart.update();
	}
</script>

<canvas bind:this={canvas}></canvas>
