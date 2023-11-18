<script>
	import BandForm from '$lib/admin/BandForm.svelte';

	export let data;
	export let form;
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat kapelu</h1>
<a href="/admin/bands">zpět</a>

<BandForm tags={data.tags}/>