export const load = async ({ params, fetch }) => {
	const result = await fetch('/api/analytics/eventGet?id=' + params.id);
	const data = await result.json();

	return {
		id: params.id,
		...data
	};
};
