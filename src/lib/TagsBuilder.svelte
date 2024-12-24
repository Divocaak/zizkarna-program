<script>
	import Tag from '$lib/Tag.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {any} [tags]
	 * @property {boolean} [isHomepageCard]
	 */

	/** @type {Props} */
	let { tags = [], isHomepageCard = false } = $props();
</script>

{#each tags as tag}
	{#if !(isHomepageCard && tag.label == '// POŘADATEL //')}
		<Tag {tag} />
	{/if}
{/each}
