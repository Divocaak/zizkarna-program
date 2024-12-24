<!-- @migration-task Error while migrating Svelte code: `<tr>` cannot be a child of `<table>`. `<table>` only allows these children: `<caption>`, `<colgroup>`, `<tbody>`, `<thead>`, `<tfoot>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script>
	import selected from '$lib/stores/tagStore.js';
	import Tag from '$lib/Tag.svelte';
	export let data;
</script>

<a href="/admin">zpět</a><br />
<a href="/admin/tags/add">vytvořit</a>
<table border="1px">
	<tr>
		<td>
			<h1>seznam band tagů</h1>
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
			<h1>seznam event tagů</h1>
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
</table>
