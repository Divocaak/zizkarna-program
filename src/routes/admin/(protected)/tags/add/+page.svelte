<script>
	import TagForm from '$lib/admin/TagForm.svelte';

	export let form;
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat tag</h1>
<a href="/admin/tags">zpět</a>

<TagForm />
