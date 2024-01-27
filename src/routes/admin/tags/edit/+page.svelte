<script>
	import selected from '$lib/stores/tagStore.js';
	import TagForm from '$lib/admin/TagForm.svelte';
	export let form;

	let selectedData;
	selected.subscribe((data) => {
		selectedData = data;
	});
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>upravit tag</h1>
<a href="/admin/tags">zpět</a>

<TagForm data={selectedData} />
