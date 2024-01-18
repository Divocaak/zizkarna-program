<script>
	import Tag from '$lib/Tag.svelte';
	export let tags = [];
	export let isHomepageCard = false;
</script>

{#each tags as tag}
	{#if !(isHomepageCard && tag.label == '// POŘADATEL //')}
		<Tag {tag} />
	{/if}
{/each}
