<script>
	import BandForm from '$lib/admin/BandForm.svelte';

	let { data, form } = $props();
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat kapelu</h1>
<a href="/admin/bands">zpět</a>

<BandForm tags={data.tags}/>