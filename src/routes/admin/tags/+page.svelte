<script>
	export let data;
</script>

<h1>seznam tagů</h1>
<a href="/admin">zpět</a>
<a href="/admin/tags/add">vytvořit</a>
<p>
	{#each data.tags as tag}
		<b>{tag.id}</b> | <span style="background-color: #{tag.bgColor}; color: #{tag.textColor}">&nbsp;{tag.label}&nbsp;</span><br />
	{/each}
</p>
