<script>
	export let tags;
</script>

{#each tags as tag}
	<span
		class="badge bg-secondary mx-1 neue"
		style="background-color:#{tag.bgColor}!important;color:#{tag.textColor}!important;"
	>
		{tag.label}
	</span>
{/each}
