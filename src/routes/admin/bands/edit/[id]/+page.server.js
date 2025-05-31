import { ADMIN_PASSWORD } from '$env/static/private';
import fs from 'fs';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		if (formData.password !== ADMIN_PASSWORD) return 'špatné heslo';

		let newTagIds = [];
		Object.keys(formData).filter(function (key) {
			if (key.indexOf('tag-') == 0) {
				newTagIds.push(parseInt(key.replace('tag-', '')));
				delete formData[key];
			}
		});

		if (newTagIds.length > 0) {
			const tagsResponse = await event.fetch('/api/tagInBand/createMultiple', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: formData.id, tags: newTagIds })
			});
			const tagsResult = await tagsResponse.json();
			if (tagsResult.status != 200) return tagsResult.message;
		}

		if (formData.removedTagsIds != undefined) {
			const oldTagsResponse = await event.fetch('/api/tagInBand/delete', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: formData.id, tags: formData.removedTagsIds })
			});
			const oldTagsResult = await oldTagsResponse.json();
			if (oldTagsResult.status != 200) return oldTagsResult.message;
		}

		const response = await event.fetch('/api/bands/update', {
			method: 'post',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(formData)
		});
		const result = await response.json();
		return result.message;
	}
};

export const load = async ({ params, fetch }) => {
	const result = await fetch('/api/bands/get?id=' + params.id);
	const data = await result.json();

	const resultSelectedTags = await fetch('/api/tagInBand/getIds?id=' + params.id);
	const dataSelectedTags = await resultSelectedTags.json();

	const resultTagsAll = await fetch('/api/tags/list?eventTagsOnly=0');
	const dataTagsAll = await resultTagsAll.json();

	let band = { links: [], imgs: [] };
	const path = '/dynamic/bands/' + params.id;
	const jsonPath = path + '/band.json';
	await fetch(jsonPath)
		.then((res) => res.json())
		.then((data) => (band = data))
		.catch(() => {
			try {
				if (!fs.existsSync('.' + jsonPath)) {
					fs.mkdirSync('.' + path, { recursive: true });
					fs.writeFileSync('.' + jsonPath, JSON.stringify(band));
				}
			} catch (err) {
				return { error: err };
			}
		});

	return {
		id: params.id,
		json: band,
		label: data.label,
		description: data.description,
		tags: dataTagsAll,
		selectedTags: dataSelectedTags
	};
};
