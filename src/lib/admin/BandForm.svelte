<script>
	import Tag from '$lib/Tag.svelte';
	export let data = null;
	export let tags;
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
			type="text"
			id="label"
			name="label"
			maxlength="64"
			required
			value={data != null && data.label != null ? data.label : null}
		/>
	</label><br />
	<label for="description">
		* popis (max 1024)<br />
		<textarea
			type="text"
			id="description"
			name="description"
			maxlength="1024"
			cols="100"
			rows="10"
			required>{data != null && data.description != null ? data.description : ''}</textarea
		>
	</label><br />
	<label for="json">
		* json<br />
		<textarea type="text" id="json" name="json" cols="100" rows="10" required
			>{data != null && data.json != null
				? JSON.stringify(data.json)
				: '{ "links": [],"imgs": [] }'}</textarea
		>
	</label><br />
	<!-- TODO BAND add/remove tags -->
	<!-- TODO BAND připsat do changelogu -->
	<label>
		* admin heslo
		<input name="password" type="password" required />
	</label><br />
	{#each tags as tag}
		<label for="tag_{tag.id}">
			<!-- URGENT tady konec, edit band page, tags render -->
			<!-- TODO BAND add data-tag-in-band-id attribute for already checked marks (edit band) -->
			<!-- TODO BAND at form submit add all checkboxes with data-in-band-id attribute to check for changes at band-tag pairs -->
			<!-- TODO BAND add attribute checked to already checked tags (edit band) -->
			<input type="checkbox" id="tag_{tag.id}" name="tag_{tag.id}" />
			<Tag {tag} />
		</label><br /> 
	{/each}
	<input type="submit" value="uložit" />
</form>

<p>do předpisu zapsat jen názvy a formáty v json formát (příklad dole)</p>
<p>nerozeznatelné domény nebudou nastylované (ikona, barva, název). rozeznatelné domény:</p>
<ul>
	<li>youtu.be</li>
	<li>youtube.com</li>
	<li>sptfy.com</li>
	<li>music.apple.com</li>
	<li>facebook.com</li>
	<li>instagram.com</li>
	<li>soundcloud.com</li>
</ul>
<p>odkazy musí obsahovat ssl sertifikát (https://)</p>
<pre>
	{JSON.stringify({
		links: ['https://youtu.be/iOPEZaVtzcw', 'https://sptfy.com/MIt1'],
		imgs: ['0.jpg', '1.jpg']
	})}
</pre>
{#if data != null && data.json != null}
	{#each data.json['imgs'] as img}
		<a href="/dynamic/bands/{data.id}/{img}" target="_blank" download="{data.id}_{img}">
			stáhnout {img}
		</a><br />
	{/each}
{/if}
