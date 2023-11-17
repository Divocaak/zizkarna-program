<script>
	export let data = null;
</script>

<form method="POST">
	{#if data != null && data.id != null}
		<label for="id">
			* id (readonly)
			<input type="number" id="id" name="id" readonly value={data.id} />
		</label><br />
	{/if}
	<label for="label">
		* název (max 128)
		<input type="text" id="label" name="label" maxlength="128" required />
	</label><br />
	<label for="date">
		* datum
		<input type="date" id="date" name="date" required />
	</label><br />
	<label for="doors">
		* dveře
		<input type="time" id="doors" name="doors" required />
	</label><br />
	<label for="cash">
		* vstup (na místě)
		<input type="number" id="cash" name="cash" required />
	</label><br />
	<label for="fbEvent">
		odkaz na fb event (max 64)
		<input type="text" id="fbEvent" name="fbEvent" maxlength="64" />
	</label><br />
	<div style="background:lightgrey; padding: 10px 0px">
		<label for="tickets">
			odkaz na předprodej (max 128)
			<input type="text" id="tickets" name="tickets" maxlength="128" />
		</label><br />
		<label for="cash">
			vstup (v předprodeji)
			<input type="number" id="presale" name="presale" />
		</label><br />
	</div>
	<label for="description">
		popis (max 2048)<br />
		<textarea
			type="text"
			id="description"
			name="description"
			maxlength="2048"
			cols="100"
			rows="10"
		/>
	</label><br />
	<label for="bands">
		* kapely<br />
		<textarea type="text" id="bands" name="bands" cols="50" />
	</label><br />
	<label for="tags">
		* tagy<br />
		<textarea type="text" id="tags" name="tags" cols="50" />
	</label><br />
	<label>
		* admin heslo
		<input name="password" type="password" required />
	</label><br />
	<input type="submit" value="uložit" />
</form>

TODO připsat do changelogu
TODO band a tag přidávání