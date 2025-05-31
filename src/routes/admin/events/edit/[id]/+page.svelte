<script>
	import EventForm from '$lib/admin/EventForm.svelte';
	export let data;
	export let form;

	const scpCommand =
		'scp -i ~/.ssh/jmhosting -r ' +
		data.id +
		'.jpg zizkarna-program@jmhosting.eu:~/htdocs/program.zizkarna.cz/dynamic/events';
	const copyScp = () => {
		navigator.clipboard.writeText(scpCommand);
	};
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>upravit event</h1>
<a href="/admin/events">zpět</a>
<EventForm
	data={data.event}
	tags={data.tags}
	selectedTags={data.selectedTags}
	bands={data.bands}
	selectedBands={data.selectedBands}
/>

<p>scp příkaz pro nahrání úvodní fotky:</p>
<code>{scpCommand}</code>
<button on:click={copyScp}>kopírovat</button>
<a href="/dynamic/events/{data.id}.jpg" target="_blank" download="{data.id}.jpg">
	stáhnout úvodku
</a><br />
