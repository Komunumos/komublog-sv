import { loadBabblesPage } from '$lib/postsService';

export const load = async () => {
	let page = 1;
	const { babbles, hasMore } = await loadBabblesPage(page);

	return {
		babbles,
		hasMore,
		loadNextPage: async () => await loadBabblesPage(++page)
	  };
};
