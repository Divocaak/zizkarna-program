<script>
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Tag from '$lib/Tag.svelte';
	export let data = null;
	export let tags;
	export let selectedTags = null;
	export let bands;
	export let selectedBands = null;
	const selectedBandsKeys = selectedBands != null ? Object.keys(selectedBands) : null;

	let dateStr = null;
	if (data != null && data.date != null) {
		const date = new Date(data.date).toLocaleDateString('cs-CZ', {}).split('. ');
		if (date[0].length < 2) date[0] = '0' + date[0];
		if (date[1].length < 2) date[1] = '0' + date[1];
		dateStr = date[2] + '-' + date[1] + '-' + date[0];
	}

	function tagIdResolver(id) {
		return selectedTags != null && selectedTags.includes(id) ? 'old-tag-' + id : 'tag-' + id;
	}

	function bandIdResolver(id, isTime = false) {
		return selectedBands != null && selectedBandsKeys.includes(id.toString())
			? 'old-band-' + (isTime ? 't' : '') + id
			: 'band-' + (isTime ? 't' : '') + id;
	}

	function resolveSetTime(id) {
		if (!(selectedBands != null && selectedBandsKeys.includes(id.toString()))) return null;
		return selectedBands[id.toString()];
	}
</script>

<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel }) => {
		const oldTags = document.querySelectorAll(`[id^="old-tag-"]`);
		let removedTagsIds = [];
		oldTags.forEach((element) => {
			if (!element.checked) removedTagsIds.push(parseInt(element.id.replace('old-tag-', '')));
		});
		if (removedTagsIds.length > 0) formData.set('removedTagsIds', removedTagsIds);

		const oldBands = document.querySelectorAll(`[id^="old-band-"]`);
		let removedBandsIds = [];
		oldBands.forEach((element) => {
			if (element.id.indexOf('old-band-t') == 0) return;
			if (!element.checked) removedBandsIds.push(parseInt(element.id.replace('old-band-', '')));
		});
		if (removedBandsIds.length > 0) formData.set('removedBandsIds', removedBandsIds);

		return async ({ result, update }) => {
			alert(result.data);
			await invalidateAll();
		};
	}}
>
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
	<div style="background:darkgrey; padding: 10px 0px">
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
		{#if selectedBands != null}
			<p>zatím přiřazeno <b>{selectedBandsKeys.length}</b>/{bands.length} kapel</p>
		{/if}
		{#each bands as band}
			<label for={bandIdResolver(band.id)}>
				<input
					type="checkbox"
					id={bandIdResolver(band.id)}
					name={bandIdResolver(band.id)}
					checked={selectedBands != null ? selectedBandsKeys.includes(band.id.toString()) : null}
				/>
				<input
					type="time"
					id={bandIdResolver(band.id, true)}
					name={bandIdResolver(band.id, true)}
					value={resolveSetTime(band.id)}
				/>
				{band.label}
			</label><br />
		{/each}
	</div>
	<div>
		{#if selectedTags != null}
			<p>zatím přiřazeno <b>{selectedTags.length}</b>/{tags.length} tagů</p>
		{/if}
		{#each tags as tag}
			<label for={tagIdResolver(tag.id)}>
				<input
					type="checkbox"
					id={tagIdResolver(tag.id)}
					name={tagIdResolver(tag.id)}
					checked={selectedTags != null ? selectedTags.includes(tag.id) : null}
				/>
				<Tag {tag} />
			</label><br />
		{/each}
	</div>
</form>
