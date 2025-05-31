import eventTemplateOrigin from '$lib/seo/templates/event.json';
import { getBandSeo, getTagName } from '$lib/seo/bandSeoBuilder.js';

export function getEventSeo(event, { tags = [], bands = [], past = false, position = null } = {}) {
	let eventTemplate = { ...eventTemplateOrigin };
	eventTemplate.name = event.label;
	eventTemplate.startDate = event.date;
	eventTemplate.endDate = event.date;
	eventTemplate.description = event.description;
	eventTemplate.url = 'https://program.zizkarna.cz/' + event.id;
	eventTemplate.doorTime = event.doors;
	eventTemplate.image = 'https://program.zizkarna.cz/dynamic/events/' + event.id + '.jpg';
	eventTemplate.isAccessibleForFree = event.cash == 0;
	eventTemplate.eventStatus = past
		? 'https://schema.org/EventPostponed'
		: 'https://schema.org/EventScheduled';
	if (position != null) eventTemplate.position = position + 1;

	if (tags.length > 0) {
		eventTemplate.keywords = tags.map((tag) => getTagName(tag.label).toLowerCase());
	}

	if (bands.length > 0) {
		eventTemplate.performer = bands.map((band) => getBandSeo(band));
		eventTemplate.keywords = eventTemplate.keywords.concat(
			...eventTemplate.performer.map((bandSeo) => bandSeo.genre)
		);
	}

	eventTemplate.offers = [
		{
			'@type': 'Offer',
			price: event.cash.toString(),
			priceCurrency: 'CZK',
			availability: 'https://schema.org/InStoreOnly',
			validFrom: event.date,
			url: null
		},
		event.tickets !== '' && event.presalePrice !== null
			? {
					'@type': 'Offer',
					price: event.presalePrice.toString(),
					priceCurrency: 'CZK',
					availability: 'https://schema.org/PreSale',
					validFrom: event.date,
					url: event.tickets
				}
			: null
	].filter(Boolean);

	return eventTemplate;
}
