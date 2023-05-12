<script>
	export let form;
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>přidat tag</h1>
<a href="/admin/tags">zpět</a>
<form method="POST">
	<label for="label">
		* název (max 64)
		<input type="text" id="label" name="label" maxlength=64 required/>
	</label><br />
	<label for="bgColor">
		* barva pozadí
		<input type="color" id="bgColor" name="bgColor" value="#000000" required/>
	</label><br />
	<label for="textColor">
		* barva textu
		<input type="color" id="textColor" name="textColor" value="#ffffff" required/>
	</label><br />
	<label>
		* admin heslo
		<input name="password" type="password" required/>
	</label><br />
	<input type="submit" value="uložit" />
</form>
