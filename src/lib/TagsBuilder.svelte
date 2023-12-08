<script>
	import Tag from '$lib/Tag.svelte';
	export let tags = [];
</script>

{#each tags as tag}
	<Tag {tag}></Tag>
{/each}
