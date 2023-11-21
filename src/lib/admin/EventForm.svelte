<script>
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Tag from '$lib/Tag.svelte';
	export let data = null;

	// TODO rewrite: no primary key from composite (event id, tag id)
	export let tags;
	export let selectedTags = null;
	let selectedTagsKeys = selectedTags != null ? Object.keys(selectedTags) : null;
	function getTagName(id) {
		if (selectedTagsKeys == null) return 'new-tag_' + id;
		return selectedTagsKeys.includes(id.toString())
		? 'old-tag_' + selectedTags[id]
		: 'new-tag_' + id;
	}
	
	// TODO rewrite: no primary key from composite (event id, band id)
	// TODO insert on duplicate key update
	// TODO delete
	export let bands;
	export let selectedBands = null;
	let selectedBandsKeys = selectedBands != null ? Object.keys(selectedBands) : null;
	function getBandName(id) {
		if (selectedBandsKeys == null) return 'new-band_' + id;
		return selectedBandsKeys.includes(id.toString())
			? 'old-band_' + selectedBands[id]
			: 'new-band_' + id;
	}

	let dateStr = null;
	if (data != null && data.date != null) {
		const date = new Date(data.date).toLocaleDateString('cs-CZ', {}).split('. ');
		if (date[0].length < 2) date[0] = '0' + date[0];
		if (date[1].length < 2) date[1] = '0' + date[1];
		dateStr = date[2] + '-' + date[1] + '-' + date[0];
	}
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
		<input
			type="text"
			id="label"
			name="label"
			maxlength="128"
			required
			value={data != null && data.label != null ? data.label : null}
		/>
	</label><br />
	<label for="date">
		* datum
		<input type="date" id="date" name="date" required value={dateStr != null ? dateStr : null} />
	</label><br />
	<label for="doors">
		* dveře
		<input
			type="time"
			id="doors"
			name="doors"
			required
			value={data != null && data.doors != null ? data.doors : null}
		/>
	</label><br />
	<label for="cash">
		* vstup (na místě)
		<input
			type="number"
			id="cash"
			name="cash"
			required
			value={data != null && data.cash != null ? data.cash : null}
		/>
	</label><br />
	<label for="fbEvent">
		odkaz na fb event (max 64)
		<input
			type="text"
			id="fbEvent"
			name="fbEvent"
			maxlength="64"
			value={data != null && data.fbEvent != null ? data.fbEvent : null}
		/>
	</label><br />
	<div style="background:lightgrey; padding: 10px 0px">
		<label for="tickets">
			odkaz na předprodej (max 128)
			<input
				type="text"
				id="tickets"
				name="tickets"
				maxlength="128"
				value={data != null && data.tickets != null ? data.tickets : null}
			/>
		</label><br />
		<label for="cash">
			vstup (v předprodeji)
			<input
				type="number"
				id="presale"
				name="presale"
				value={data != null && data.presalePrice != null ? data.presalePrice : null}
			/>
		</label><br />
	</div>
	<label for="description">
		popis (max 2048)<br />
		<textarea type="text" id="description" name="description" maxlength="2048" cols="100" rows="10"
			>{data != null && data.description != null ? data.description : null}</textarea
		>
	</label><br />
	<label for="is_visible">
		zveřejnit?
		<input
			type="checkbox"
			id="is_visible"
			name="is_visible"
			checked={data != null && data.is_visible != null ? data.is_visible : true}
		/>
	</label><br />
	<label>
		* admin heslo
		<input name="password" type="password" required />
	</label><br />
	<input type="submit" value="uložit" /><br /><br />
	<div style="float:left;">
		{#if selectedTagsKeys != null}
			<p>zatím přiřazeno <b>{selectedBandsKeys.length}</b>/{bands.length} kapel</p>
		{/if}
		{#each bands as band}
			<label for={getBandName(band.id)}>
				<input
					type="checkbox"
					id={getBandName(band.id)}
					name={getBandName(band.id)}
					checked={selectedBandsKeys != null
						? selectedBandsKeys.includes(band.id.toString())
						: null}
				/>
				<input type="time" id={getBandName(band.id)} name={getBandName(band.id)} />
				{band.label}
			</label><br />
		{/each}
	</div>
	<div>
		{#if selectedTagsKeys != null}
			<p>zatím přiřazeno <b>{selectedTagsKeys.length}</b>/{tags.length} tagů</p>
		{/if}
		{#each tags as tag}
			<label for={getTagName(tag.id)}>
				<input
					type="checkbox"
					id={getTagName(tag.id)}
					name={getTagName(tag.id)}
					checked={selectedTagsKeys != null ? selectedTagsKeys.includes(tag.id.toString()) : null}
				/>
				<Tag {tag} />
			</label><br />
		{/each}
	</div>
</form>

<!-- TODO EVENT připsat do changelogu -->
<!-- TODO EVENT band a tag přidávání -->
