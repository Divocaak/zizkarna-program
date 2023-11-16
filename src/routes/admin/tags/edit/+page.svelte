<script>
	import selected from '$lib/admin/Store.js';
	import TagForm from '$lib/admin/TagForm.svelte';
	export let form;

	let selectedData;
	selected.subscribe((data) => {
		selectedData = data;
	});
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat tag</h1>
<a href="/admin/tags">zpět</a>

<TagForm data={selectedData} />
