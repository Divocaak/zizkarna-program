import { getEventDetailed } from '$lib/apiShortcuts/getEventDetailed.js'

export const load = async ({ params, fetch }) => {
    return await getEventDetailed({ params, fetch });
}