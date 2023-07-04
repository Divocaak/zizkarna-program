<script>
	export let data;
	let event = data.event;
	let bands = [];
	if (data.bands !== undefined) {
		bands = data.bands;
	}

	function removeLastSlashes(tag) {
		return tag.substring(0, tag.length - 2);
	}
</script>

<a href="/admin/events">zpět</a>
<p>{event.eventLabel}</p>
<p><b>od čáry dolů zkopírovat celé do popisu události</b></p>
<hr>
<p>
	{#each event.tags as tag}
		{removeLastSlashes(tag.label)}
	{/each}
	//
</p>
<p>👉 více informací na https://program.zizkarna.cz/{event.id}</p>
{#each bands as band}
	<p>
		// {band.label}<br />
		{#if band.description != '' && band.description != ' ' && band.description != null}
			{band.description}<br />
		{/if}
		{#each band.links as link}
			🔘 {link}<br />
		{/each}
	</p>
{/each}
<p>Vstup na místě: {event.cash} Kč</p>
<!-- BUG správnej formát? -->
<p>
	// Harmonogram<br />
	🚪 {event.doors.substring(0, event.doors.length - 3)} otevření Žižkárny
</p>
