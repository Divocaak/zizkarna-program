<script>
	import selected from '$lib/stores/tagStore.js';
	import Tag from '$lib/Tag.svelte';
	export let data;
</script>

<a href="/admin">zpět</a><br />
<a href="/admin/tags/add">vytvořit</a>
<table border="1px">
	<thead>
		<tr>
			<th>seznam band tagů</th>
			<th>seznam event tagů</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<table>
					{#each data.band as tag}
						<tr>
							<td>
								<b>{tag.id}</b>
							</td>
							<td>
								<Tag {tag} />
							</td>
							<td>
								<a href="/admin/tags/edit" on:click={() => selected.update(() => tag)}> upravit </a>
							</td>
						</tr>
					{/each}
				</table>
			</td>
			<td style="vertical-align:top">
				<table>
					{#each data.event as tag}
						<tr>
							<td>
								<b>{tag.id}</b>
							</td>
							<td>
								<Tag {tag} />
							</td>
							<td>
								<a href="/admin/tags/edit" on:click={() => selected.update(() => tag)}> upravit </a>
							</td>
						</tr>
					{/each}
				</table>
			</td>
		</tr>
	</tbody>
</table>
