<script>
	import { onMount } from 'svelte';

	let data = "";

	onMount(() => {
		// Listen for messages from the parent window
		window.addEventListener('message', (event) => {
			data = event.data;
			// Trigger a reactive update
			$: data;
		});
	});
</script>

<h1>generator preview</h1>
{@html $data}
