<script>
    export let data;
</script>

<h1>seznam kapel</h1>
<a href="/admin">zpět</a><br>
<a href="/admin/bands/add">vytvořit</a>
<table class="admin-table">
	{#each data.bands as band}
	<tr>
		<td>
			<b>{band.id}</b>
		</td>
		<td>
			{band.label}
		</td>
		<td>
			<a href="/admin/bands/edit/{band.id}">upravit</a>
		</td>
	</tr>
	{/each}
</table>
