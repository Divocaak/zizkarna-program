<script>
	import content from '$lib/content.json';
	import Card from '$lib/Card.svelte';

	var tags = content['tags'];
	var events = content['events'];
</script>

<div class="my-5">
	{#each events as event}
		<Card {event} {tags} />
		<hr class="border-2 mx-5" />
	{/each}
</div>
