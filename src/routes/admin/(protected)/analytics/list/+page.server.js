export const load = async ({ params, fetch }) => {
	const result = await fetch('/api/analytics/eventList');
	const data = await result.json();

	return {
		events: data
	};
};
