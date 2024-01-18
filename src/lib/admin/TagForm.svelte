<script>
	export let data = null;

	let txtValField;
	let txtVal = '// TEST TAG //';
	let bgField;
	let bgColor = '000000';
	let txtField;
	let txtColor = 'FFFFFF';

	const refreshTxtVal = () => (txtVal = txtValField.value);
	const refreshBgColor = () => (bgColor = bgField.value);
	const refreshTxtColor = () => (txtColor = txtField.value);
</script>

<form method="POST">
	{#if data != null && data.id != null}
		<label for="id">
			id (readonly)
			<input type="text" id="id" name="id" value={data.id} readonly />
		</label><br />
	{/if}
	<label for="label">
		* název (max 64)
		<input
			bind:this={txtValField}
			on:input={refreshTxtVal}
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
			bind:this={bgField}
			on:input={refreshBgColor}
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
			bind:this={txtField}
			on:input={refreshTxtColor}
			type="color"
			id="textColor"
			name="textColor"
			required
			value={data != null && data.textColor != null ? '#' + data.textColor : '#ffffff'}
		/>
	</label><br />
	<label for="eventTag">
		tag pouze pro event
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
<p>
	preview:
	<span
		class="tag badge"
		style="background-color:{bgColor}!important;color:{txtColor}!important;border:2.5px solid {txtColor};"
	>
		{txtVal}
	</span>
</p>

<style>
	.tag {
		font-family: monospace;
		padding: 5px 10px;
		border-radius: 5px;
		font-weight: bold;
	}
</style>
