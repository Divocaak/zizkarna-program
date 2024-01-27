export async function getEventDetailed({ params, fetch }) {

    const result = await fetch("/api/events/get?id=" + params.id);
    const data = await result.json();

    const eventTagsResult = await fetch("/api/tagInEvent/get?id=" + params.id);
    const dataEventTags = await eventTagsResult.json();

    const resultBands = await fetch("/api/bandInEvent/get?id=" + params.id);
    const dataBands = await resultBands.json();

    await Promise.all(dataBands.map(async (band) => {
        const res = await fetch("/dynamic/bands/" + band.id + "/band.json");
        const data = res.ok ? await res.json() : { imgs: [], links: [] };
        band.imgs = data.imgs || [];
        band.links = data.links || [];

        const resultBandTags = await fetch("/api/tagInBand/get?id=" + band.id);
        band.tags = await resultBandTags.json();
    }));

    const sortedBands = dataBands.sort((a, b) => {
        const aBandHour = parseInt(a.stageTime.split(":")[0]);
        const bBandHour = parseInt(b.stageTime.split(":")[0]);
        const eventStartHour = parseInt(data.doors.split(":")[0]);

        const aRelativeTime = aBandHour - eventStartHour;
        const bRelativeTime = bBandHour - eventStartHour;

        if (aRelativeTime < 0 && bRelativeTime < 0)
            return (bRelativeTime - aRelativeTime) * -1;
        else if (aRelativeTime > 0 && bRelativeTime < 0)
            return (bRelativeTime - aRelativeTime);
        else
            return aRelativeTime - bRelativeTime;
    });

    const eventDate = new Date(data.date);
    eventDate.setDate(new Date(data.date).getDate() + 1);
    const isPast = eventDate < (new Date());

    return {
        event: data,
        isPast: isPast,
        eventTags: dataEventTags,
        bands: sortedBands
    }
}