import { ADMIN_PASSWORD } from '$env/static/private';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		if (formData.password !== ADMIN_PASSWORD) return 'špatné heslo';

		let newBandPairs = [];
		let newTagIds = [];
		Object.keys(formData).filter(function (key) {
			if (key.indexOf('tag-') == 0) {
				newTagIds.push(parseInt(key.replace('tag-', '')));
				delete formData[key];
			}

			if (key.indexOf('band-') == 0) {
				if (key.indexOf('band-t') == 0) return;
				const id = key.replace('band-', '');
				const timeKey = 'band-t' + id;
				const time = formData[timeKey] == '' ? null : formData[timeKey];
				newBandPairs.push([parseInt(id), time]);
				delete formData[key];
				delete formData[timeKey];
			}

			if (key.indexOf('old-band-') == 0) {
				if (key.indexOf('old-band-t') == 0) return;
				if (formData[key] != 'on') return;
				const id = key.replace('old-band-', '');
				const timeKey = 'old-band-t' + id;
				const time = formData[timeKey] == '' ? null : formData[timeKey];
				newBandPairs.push([parseInt(id), time]);
				delete formData[key];
				delete formData[timeKey];
			}
		});

		if (newTagIds.length > 0) {
			const tagsResponse = await event.fetch('/api/tagInEvent/createMultiple', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: formData.id, tags: newTagIds })
			});
			const tagsResult = await tagsResponse.json();
			if (tagsResult.status != 200) return tagsResult.message;
		}

		if (formData.removedTagsIds != undefined) {
			const oldTagsResponse = await event.fetch('/api/tagInEvent/delete', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: formData.id, tags: formData.removedTagsIds })
			});
			const oldTagsResult = await oldTagsResponse.json();
			if (oldTagsResult.status != 200) return oldTagsResult.message;
		}

		if (newBandPairs.length > 0) {
			const bandsResponse = await event.fetch('/api/bandInEvent/insertUpdateMultiple', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: formData.id, bands: newBandPairs })
			});
			const bandsResult = await bandsResponse.json();
			if (bandsResult.status != 200) return bandsResult.message;
		}

		if (formData.removedBandsIds != undefined) {
			const oldBandsResponse = await event.fetch('/api/bandInEvent/delete', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: formData.id, bands: formData.removedBandsIds })
			});
			const oldBandsResult = await oldBandsResponse.json();
			if (oldBandsResult.status != 200) return oldBandsResult.message;
		}

		const response = await event.fetch('/api/events/update', {
			method: 'post',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				label: formData.label,
				date: formData.date,
				doors: formData.doors,
				cash: formData.cash,
				presale: formData.presale != '' ? formData.presale : null,
				fbEvent: formData.fbEvent != '' ? formData.fbEvent : null,
				tickets: formData.tickets != '' ? formData.tickets : null,
				description: formData.description != null ? formData.description : null,
				is_visible: formData.is_visible == 'on',
				id: formData.id,
				yt: formData.yt != '' ? formData.yt : null
			})
		});
		const result = await response.json();
		return result.message;
	}
};

export const load = async ({ params, fetch }) => {
	const result = await fetch('/api/events/get?id=' + params.id);
	const data = await result.json();

	const resultTags = await fetch('/api/tags/list?eventTagsOnly=1');
	const dataTags = await resultTags.json();

	const resultSelectedTags = await fetch('/api/tagInEvent/getIds?id=' + params.id);
	const dataSelectedTags = await resultSelectedTags.json();

	const resultBands = await fetch('/api/bands/list');
	const dataBands = await resultBands.json();

	const resultSelectedBands = await fetch('/api/bandInEvent/getSimple?id=' + params.id);
	const dataSelectedBands = await resultSelectedBands.json();

	return {
		event: data,
		bands: dataBands,
		tags: dataTags,
		selectedTags: dataSelectedTags,
		selectedBands: dataSelectedBands
	};
};
