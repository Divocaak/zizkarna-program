<script>
	import { enhance } from '$app/forms';
	import Tag from '$lib/Tag.svelte';
	export let data = null;
	export let tags;
	export let selectedTags = null;

	function getTagName(id, tbId) {
		/* URGENT tady musi byt tag_in_band.id, ne tag.id */
		return selectedTags.includes(id) ? 'old-tag_' + tbId : 'new-tag_' + id;
	}
</script>

<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel }) => {
		const elements = document.querySelectorAll(`[id^="old-tag_"]`);
		let removedTagsIds = [];
		elements.forEach((element) => {
			if (!element.checked) removedTagsIds.push(parseInt(element.id.replace('old-tag_', '')));
		});
		if (removedTagsIds.length > 0) formData.set('removedTagsIds', removedTagsIds);
	}}
>
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
	<input type="submit" value="uložit" /><br /><br>
	{#each tags as tag}
		<label for={getTagName(tag.id, tag.tag_in_band_id)}>
			<!-- TODO BAND at form submit add all checkboxes with data-in-band-id attribute to check for changes at band-tag pairs -->
			<!-- TODO BAND add attribute checked to already checked tags (edit band) -->
			<input
				type="checkbox"
				id={getTagName(tag.id, tag.tag_in_band_id)}
				name={getTagName(tag.id, tag.tag_in_band_id)}
				checked={selectedTags != null ? selectedTags.includes(tag.id) : null}
			/>
			<Tag {tag} />
		</label><br />
	{/each}
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
