export const load = async ({ params, fetch }) => {
	const result = await fetch('/api/events/listSimple');
	const data = await result.json();

	return {
		events: data
	};
};
