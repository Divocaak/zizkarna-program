<script>
	import content from '$lib/content.json';
	import Card from '$lib/Card.svelte';

	var tags = content['tags'];
	var events = content['events'];
</script>

<!-- TODO share btn (on click, find id, scroll to) -->
<!-- TODO add to calendar -->
{#each events as event}
	<Card event={event} tags={tags}/>
	<hr class="border-2 mx-5" />
{/each}
