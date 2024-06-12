<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const preview = writable(null);

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const requestData = JSON.parse(params.get('data'));

		fetch(requestData.requestPath, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData.requestBody)
		})
			.then((response) => response.json())
			.then((data) => {
				preview.set(data.output);
			})
			.catch((error) => console.error('Error:', error));
	});
</script>

{@html $preview}
