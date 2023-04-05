<script>
	export let tagsBank;
	export let actualTags;
</script>

{#each actualTags as tag}
	<span
		class="badge bg-secondary mx-1 neue"
		style="background-color:{tagsBank[tag].bgColor}!important;color:{tagsBank[tag].textColor}!important;"
	>
		{tagsBank[tag].label}
	</span>
{/each}
