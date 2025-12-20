import { getEventDetailed } from '$lib/scripts/getEventDetailed.js';

export const load = async ({ params, fetch }) => {
	return await getEventDetailed({ params, fetch });
};
