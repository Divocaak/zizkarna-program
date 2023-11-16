<script>
	export let data = null;
</script>

<form method="POST">
	{#if data != null && data.id != null}
		<label for="id">
			id (readonly)
			<input type="text" id="id" name="id" value={data.id} readonly/>
		</label><br />
	{/if}
	<label for="label">
		* název (max 64)
		<input
			type="text"
			id="label"
			name="label"
			maxlength="64"
			required
			value={data != null && data.label != null ? data.label : null}
		/>
	</label><br />
	<label for="bgColor">
		* barva pozadí
		<input
			type="color"
			id="bgColor"
			name="bgColor"
			required
			value={data != null && data.bgColor != null ? '#' + data.bgColor : '#000000'}
		/>
	</label><br />
	<label for="textColor">
		* barva textu
		<input
			type="color"
			id="textColor"
			name="textColor"
			required
			value={data != null && data.textColor != null ? '#' + data.textColor : '#ffffff'}
		/>
	</label><br />
	<label for="eventTag">
		eventový tag
		<input
			type="checkbox"
			id="eventTag"
			name="eventTag"
			checked={data != null && data.eventTag != null ? data.eventTag : null}
		/>
	</label><br />
	<label>
		* admin heslo
		<input name="password" type="password" required />
	</label><br />
	<input type="submit" value="uložit" />
</form>
