<script>
	export let data;
	export let form;

	console.log(data);
</script>
{#if form !== null}<p>{form}</p>{/if}
<h1>upravit kapelu</h1>
<a href="/admin/bands">zpět</a>
<form method="POST">
	<textarea type="text" id="json" name="json" cols=40 rows=20 required>{JSON.stringify(data)}</textarea><br />
	<label>
		* admin heslo
		<input name="password" type="password" required />
	</label><br />
	<input type="submit" value="uložit" />
</form>
<p>
	fotky musí přidat vojtěch přes databázi (srry ale nahrávání fotek se mi fakt nechtělo kódovat)
</p>
