<script>
	import { selectedEvent, selectedBand } from '$lib/stores/videoBandStore.js';
	export let data;
	const event = data.event;
	const bands = data.bands ?? [];
</script>

<a href="/admin/events">zpět</a><br /><br />
{#each bands as band}
	<a
		href="/admin/events/video/{event.id}/generator"
		on:click={() => {
			selectedEvent.update(() => event);
			selectedBand.update(() => band);
		}}>{band.label}</a
	><br />
{/each}
