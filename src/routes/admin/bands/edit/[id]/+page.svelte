<script>
	export let data;
	export let form;

	const scpCommand =
		'scp -i ~/.ssh/jmhosting -r ' +
		data.id +
		' zizkarna-program@jmhosting.eu:~/htdocs/program.zizkarna.cz/dynamic/bands';
	const copyScp = () => {
		navigator.clipboard.writeText(scpCommand);
	};
</script>

{#if form !== null}<p>{form}</p>{/if}
<h1>upravit kapelu</h1>
<a href="/admin/bands">zpět</a>
<form method="POST">
	<label for="id">
		* id (readonly)
		<input type="number" id="id" name="id" required readonly value={data.id} />
	</label><br />
	<textarea type="text" id="json" name="json" cols="40" rows="20" required
		>{JSON.stringify(data.json)}</textarea
	><br />
	<label>
		* admin heslo
		<input name="password" type="password" required />
	</label><br />
	<input type="submit" value="uložit" />
</form>
<p>scp příkaz pro nahrání fotek (posílá celou složku):</p>
<code>{scpCommand}</code>
<button on:click={copyScp}>kopírovat</button>
<p>do předpisu zapsat jen názvy a formáty v json formát (příklad dole)</p>
<p>nerozeznatelné domény nebudou nastylované (ikona, barva, název). rozeznatelné domény:</p>
<ul>
	<li>youtu.be</li>
	<li>youtube.com</li>
	<li>sptfy.com</li>
	<li>music.apple.com</li>
	<li>facebook.com</li>
	<li>instagram.com</li>
</ul>
<p>odkazy musí obsahovat ssl sertifikát (https://)</p>
<pre>
	{JSON.stringify({
		links: ['https://youtu.be/iOPEZaVtzcw', 'https://sptfy.com/MIt1'],
		imgs: ['0.jpg', '1.jpg']
	})}
</pre>
{#each data.json['imgs'] as img}
	<a href="/dynamic/bands/{data.id}/{img}" target="_blank" download="{data.id}_{img}">stáhnout {img}</a><br />
{/each}