<script>
	export let data;
</script>

<h1>seznam tagů</h1>
<a href="/admin">zpět</a><br />
<a href="/admin/tags/add">vytvořit</a>
<table class="admin-table">
	{#each data.tags as tag}
		<tr>
			<td>
				<b>{tag.id}</b>
			</td>
			<td>
				<span style="background-color: #{tag.bgColor}; color: #{tag.textColor}">
					&nbsp;{tag.label}&nbsp;
				</span>
			</td>
		</tr>
	{/each}
</table>
