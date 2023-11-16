<script>
	import BandForm from '$lib/admin/BandForm.svelte';

	export let form;
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat kapelu</h1>
<a href="/admin/bands">zpět</a>

<BandForm />

<!-- URGENT test new creation with json -->