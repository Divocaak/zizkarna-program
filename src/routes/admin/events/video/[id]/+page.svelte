<script>
	import { setBand, setEvent } from '$lib/stores/videoStore.js';
	export let data;
	const event = data.event;
	const bands = data.bands ?? [];
</script>

<a href="/admin/events">zpět</a><br /><br />
{#each bands as band}
	<a
		href="/admin/events/video/{event.id}/generator"
		on:click={() => {
			setEvent(event);
			setBand(band);
		}}>{band.label}</a
	><br />
{/each}
