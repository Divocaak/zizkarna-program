<script>
	import BandForm from '$lib/admin/BandForm.svelte';

	export let data;
	export let form;

	const scpCommand =
		'scp -i ~/.ssh/jmhosting -r ' +
		data.id +
		' zizkarna-program@jmhosting.eu:~/htdocs/program.zizkarna.cz/dynamic/bands';
	const copyScp = () => {
		navigator.clipboard.writeText(scpCommand);
	};
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>upravit kapelu</h1>
<a href="/admin/bands">zpět</a>
<BandForm {data} />

<p>scp příkaz pro nahrání fotek (posílá celou složku):</p>
<code>{scpCommand}</code>
<button on:click={copyScp}>kopírovat</button>

<!-- URGENT update band endpoint -->