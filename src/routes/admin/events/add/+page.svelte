<script>
	import EventForm from '$lib/admin/EventForm.svelte';

	export let form;
	export let data;
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat event</h1>
<a href="/admin/events">zpět</a>

<EventForm tags={data.tags} bands={data.bands}/>