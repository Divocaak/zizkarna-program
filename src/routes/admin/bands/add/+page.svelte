<script>
	export let form;
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat kapelu</h1>
<a href="/admin/bands">zpět</a>
<form method="POST">
	<label for="label">
		* název (max 64)
		<input type="text" id="label" name="label" maxlength="64" required />
	</label><br />
	<label for="description">
		* popis (max 1024)
		<textarea type="text" id="description" name="description" maxlength="1024" cols=40 rows=20 required />
	</label><br />
	<label>
		* admin heslo
		<input name="password" type="password" required />
	</label><br />
	<input type="submit" value="uložit" />
</form>
<p>
	adresy fotek a odkazy na socky lze přidat/upravit přes seznam kapel a tlačítko <i>upravit</i>
	<br />
	fotky pak musí přidat vojtěch přes databázi (srry ale nahrávání fotek se mi fakt nechtělo kódovat)
</p>
