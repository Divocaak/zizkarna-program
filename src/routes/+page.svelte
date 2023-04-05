<script>
	import events from '$lib/content/events.json';
	import tags from '$lib/content/tags.json';
	import Card from '$lib/Card.svelte';
</script>

<div class="my-5">
	{#each events as event}
		<Card {event} {tags} />
		<hr class="border-2 mx-5" />
	{/each}
</div>
