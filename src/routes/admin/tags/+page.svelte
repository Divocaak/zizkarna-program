<script>
	import selected from '$lib/stores/tagStore.js';
	import Tag from '$lib/Tag.svelte';
	export let data;
</script>

<a href="/admin">zpět</a><br />
<a href="/admin/tags/add">vytvořit</a>
<table border="1px">
	<tbody>
		<tr>
			<td>
				<h1>seznam band tagů</h1>
				<table>
					<tbody>
						{#each data.band as tag}
							<tr>
								<td>
									<b>{tag.id}</b>
								</td>
								<td>
									<Tag {tag} />
								</td>
								<td>
									<a href="/admin/tags/edit" on:click={() => selected.update(() => tag)}>
										upravit
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</td>
			<td style="vertical-align:top">
				<h1>seznam event tagů</h1>
				<table>
					<tbody>
						{#each data.event as tag}
							<tr>
								<td>
									<b>{tag.id}</b>
								</td>
								<td>
									<Tag {tag} />
								</td>
								<td>
									<a href="/admin/tags/edit" on:click={() => selected.update(() => tag)}>
										upravit
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
</table>
