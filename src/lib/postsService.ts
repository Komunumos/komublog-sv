import { pb } from '$lib/pocketbase';
import type { ListResult } from 'pocketbase';
import type { Babble } from '@models/babble';

export async function loadBabblesPage(
	page = 1,
	filter: string | null = null
): Promise<{ babbles: Babble[]; hasMore: boolean }> {

	const babbles: ListResult<Babble> = await pb
		.collection('postsView')
		.getList<Babble>(page, 20, filter ? { filter } : {});
	return { babbles: babbles.items, hasMore: page < babbles.totalPages };
}
