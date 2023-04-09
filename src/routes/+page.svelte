<script>
	export let data;
	import Card from '$lib/Card.svelte';
</script>

<div class="my-5">
	{#each data.events as event}
		<Card {event} />
		<hr class="border-2 mx-5" />
	{/each}
</div>
