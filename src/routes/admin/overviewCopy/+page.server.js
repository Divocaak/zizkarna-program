/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		const selectedDate = formData.selectedDate;
		const month = selectedDate.substring(selectedDate.length - 2, selectedDate.length);
		const year = selectedDate.substring(0, 4);

		const label = new Date(year, month - 1, 1).toLocaleString('cs-CZ', { month: 'long' });

		const response = await event.fetch(`/api/videoGenerators/copyText?year=${year}&month=${month}`);
		const data = await response.json();

		await Promise.all(
			Object.values(data).flatMap((currentEvent) =>
				currentEvent.bands.map(async (band) => {
					const bandJson = await event.fetch('/dynamic/bands/' + band.id + '/band.json');
					if (!bandJson.ok) return;

					const jsonData = bandJson.ok ? await bandJson.json() : null;
					if (!jsonData.links.length) return;

					const instagramPrefix = 'https://instagram.com/';
					const instagramLink = jsonData.links.find((link) => link.startsWith(instagramPrefix));
					if (!instagramLink) return;

					let instagramProfile = instagramLink.substring(instagramPrefix.length);
					if (instagramProfile.endsWith('/')) instagramProfile = instagramProfile.slice(0, -1);
					band['instagramProfile'] = instagramProfile;
				})
			)
		);

		return { label: label, events: data };
	}
};
