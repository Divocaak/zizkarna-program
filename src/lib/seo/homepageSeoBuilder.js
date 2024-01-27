import homepageTemplate from '$lib/seo/templates/homepage.json';
import { getEventSeo } from "$lib/seo/eventSeoBuilder.js";

export function getHomepageSeo(closest, future, older) {

    homepageTemplate.itemListElement = homepageTemplate.itemListElement.concat(
        closest.map((event, index) => getEventSeo(event, { tags: event.tags, position: index })),
        future.map((event, index) => getEventSeo(event, { tags: event.tags, position: (index + closest.length) })),
        older.map((event, index) => getEventSeo(event, { tags: event.tags, position: (index + closest.length + future.length), past: true }))
    );

    return homepageTemplate;
}