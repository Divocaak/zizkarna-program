export async function getEventDetailed({ params, fetch }) {
	const result = await fetch('/api/events/get?id=' + params.id);
	const data = await result.json();

	const eventTagsResult = await fetch('/api/tagInEvent/get?id=' + params.id);
	const dataEventTags = await eventTagsResult.json();

	const resultBands = await fetch('/api/bandInEvent/get?id=' + params.id);
	const dataBands = await resultBands.json();

	await Promise.all(
		dataBands.map(async (band) => {
			const res = await fetch('/dynamic/bands/' + band.id + '/band.json');
			const data = res.ok ? await res.json() : { imgs: [], links: [] };
			band.imgs = data.imgs || [];
			band.links = data.links || [];

			const resultBandTags = await fetch('/api/tagInBand/get?id=' + band.id);
			band.tags = await resultBandTags.json();
			band.tags.forEach((tag) => {
				if (tag.label == '// POŘADATEL //') {
					band.isCoorganiser = true;
				}
			});
		})
	);

	const eventStartHour = parseInt(data.doors.split(':')[0]);
	let splitIndex = null;
	for (let i = 0; i < dataBands.length; i++) {
		const bandStageTime = parseInt(dataBands[i].stageTime.split(':')[0]);
		if (bandStageTime < eventStartHour) splitIndex = i;
	}

	if (splitIndex !== null) dataBands.push(...dataBands.splice(0, splitIndex + 1));

	const eventDate = new Date(data.date);
	eventDate.setDate(new Date(data.date).getDate() + 1);
	const isPast = eventDate < new Date();

	return {
		event: data,
		isPast: isPast,
		eventTags: dataEventTags,
		bands: dataBands
	};
}
