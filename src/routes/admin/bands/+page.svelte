<script>
    export let data;
</script>

<h1>seznam kapel</h1>
<a href="/admin">zpět</a>
<a href="/admin/bands/add">vytvořit</a>
<p>
	{#each data.bands as band}
		<b>{band.id}</b> | {band.label}<br />
	{/each}
</p>
