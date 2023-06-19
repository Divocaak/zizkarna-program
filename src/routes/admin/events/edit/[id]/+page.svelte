<script>
	export let data;
	export let form;

	const scpCommand = "scp -i ~/.ssh/jmhosting -r " + data.id + ".jpg program@jmhosting.eu:~/htdocs/program.zizkarna.cz/dynamic/events";
	const copyScp = () => {navigator.clipboard.writeText(scpCommand);}
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>upravit event</h1>
<a href="/admin/events">zpět</a>
<form method="POST">
	<label for="id">
		* id (readonly)
		<input type="number" id="id" name="id" required readonly value={data.id} />
	</label><br />
	<label for="bands">
		* kapely
		<textarea type="text" id="bands" name="bands" cols="40" />
	</label><br />
	<label for="tags">
		* tagy
		<textarea type="text" id="tags" name="tags" cols="40" />
	</label><br />
	<label>
		* admin heslo
		<input name="password" type="password" required />
	</label><br />
	<input type="submit" value="uložit" />
</form>
<p>scp příkaz pro nahrání úvodní fotky:</p>
<code>{scpCommand}</code>
<button on:click={copyScp}>kopírovat</button>
<a href="/dynamic/events/{data.id}.jpg" target="_blank" download="{data.id}.jpg">stáhnout úvodku</a><br />
<p>vyplňuj jen idčka oddělená tečkou (příklad dole)</p>
<pre>1.2.3</pre>
<p>seznamy:</p>
<table class="admin-table">
	{#each data.tags as tag}
		<tr>
			<td>
				<b>{tag.id}</b>
			</td>
			<td>
				<span style="background-color: #{tag.bgColor}; color: #{tag.textColor}">
					&nbsp;{tag.label}&nbsp;
				</span>
			</td>
		</tr>
	{/each}
</table>
<table class="admin-table">
	{#each data.bands as band}
		<tr>
			<td>
				<b>{band.id}</b>
			</td>
			<td>
				{band.label}
			</td>
		</tr>
	{/each}
</table>

<style>
	table {
		display: inline-block;
	}
</style>
