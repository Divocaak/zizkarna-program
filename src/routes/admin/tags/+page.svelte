<script>
	import selected from '$lib/admin/Store.js';
	export let data;
</script>

<a href="/admin">zpět</a><br />
<a href="/admin/tags/add">vytvořit</a>
<table border="1px">
	<tr>
		<td>
			<h1>seznam band tagů</h1>
			<table>
				{#each data.tags as tag}
					{#if !tag.eventTag}
						<tr>
							<td>
								<b>{tag.id}</b>
							</td>
							<td>
								<span style="background-color: #{tag.bgColor}; color: #{tag.textColor}">
									&nbsp;{tag.label}&nbsp;
								</span>
							</td>
							<td>
								<a href="/admin/tags/edit" on:click={() => selected.update(() => tag)}> upravit </a>
							</td>
						</tr>
					{/if}
				{/each}
			</table>
		</td>
		<td style="vertical-align:top">
			<h1>seznam event tagů</h1>
			<table>
				{#each data.tags as tag}
					{#if tag.eventTag}
						<tr>
							<td>
								<b>{tag.id}</b>
							</td>
							<td>
								<span style="background-color: #{tag.bgColor}; color: #{tag.textColor}">
									&nbsp;{tag.label}&nbsp;
								</span>
							</td>
							<td>
								<a href="/admin/tags/edit" on:click={() => selected.update(() => tag)}> upravit </a>
							</td>
						</tr>
					{/if}
				{/each}
			</table>
		</td>
	</tr>
</table>
