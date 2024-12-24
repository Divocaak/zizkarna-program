<script>
	import TagForm from "$lib/admin/TagForm.svelte";

	let { form } = $props();
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat tag</h1>
<a href="/admin/tags">zpět</a>

<TagForm />