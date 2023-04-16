import { loadBabblesPage } from '$lib/postsService';

export const load = async () => {
	console.log('loading root')
	const { babbles, hasMore } = await loadBabblesPage(1);

	return {
		babbles,
		hasMore,
		loadBabblesPage
	  };
};
