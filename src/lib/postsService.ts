import { pb } from '$lib/pocketbase';
import type { ListResult } from 'pocketbase';
import type { Babble } from '../types/babble';

let currentPage = 1;
let currentFilter: string | null;

export async function loadBabblesPage(
	page: number | null = null,
	filter: string | null = null
): Promise<{ babbles: Babble[]; hasMore: boolean }> {
	if (filter) {
		currentFilter = filter;
		currentPage = 1;
	}

	if (page) currentPage = 1;

	const babbles: ListResult<Babble> = await pb
		.collection('postsView')
		.getList<Babble>(currentPage++, 20, currentFilter ? { filter: currentFilter } : {});
	return { babbles: babbles.items, hasMore: currentPage <= babbles.totalPages };
}
