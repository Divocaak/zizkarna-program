import bandTemplateOrigin from '$lib/seo/templates/band.json';

export function getBandSeo(band) {
    let bandTemplate = { ...bandTemplateOrigin };
    bandTemplate.name = band.label;
    bandTemplate.description = band.description;
    bandTemplate.performTime = band.stageTime;
    bandTemplate.genre = band.tags.map(tag => getTagName(tag.label).toLowerCase());;
    bandTemplate.sameAs = band.links;
    return bandTemplate;
}

export function getTagName(tag) {
    const match = tag.match(/^\/\/ (.+?) \/\/$/);
    return match ? match[1] : '';
}