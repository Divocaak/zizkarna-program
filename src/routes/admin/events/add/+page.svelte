<script>
	export let form;
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat event</h1>
<a href="/admin/events">zpět</a>
<form method="POST">
	<label for="label">
		* název (max 128)
		<input type="text" id="label" name="label" maxlength=128 required/>
	</label><br />
	<label for="date">
		* datum
		<input type="date" id="date" name="date" required/>
	</label><br />
	<label for="doors">
		* dveře
		<input type="time" id="doors" name="doors" required/>
	</label><br />
	<label for="cash">
		* vstup (na místě)
		<input type="number" id="cash" name="cash" required/>
	</label><br />
	<label for="fbEvent">
		odkaz na fb event (max 64)
		<input type="text" id="fbEvent" name="fbEvent" maxlength=64/>
	</label><br />
	<label for="tickets">
		odkaz na předprodej (max 128)
		<input type="text" id="tickets" name="tickets" maxlength=128/>
	</label><br />
	<label>
		* admin heslo
		<input name="password" type="password" required/>
	</label><br />
	<input type="submit" value="uložit" />
</form>
<p>grafiku k události musí přidat vojtěch přes databázi (srry ale nahrávání fotek se mi fakt nechtělo kódovat)</p>