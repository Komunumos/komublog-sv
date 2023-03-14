import type { Babble } from './../types/babble';
import type { RouteParams } from './$types';
import { pb } from '../lib/pocketbase';
import type { ListResult } from 'pocketbase';
import { babbleStore } from '../stores/babbleStore';

export const load = async ({ params }: { params: RouteParams }) => {
	const posts: ListResult<any> = await pb.collection('postsView').getList(1, 50);
	const babblePosts = posts.items.map((i) => {
		const b: Babble = { ...i };
		return b;
	});
	babbleStore.set(babblePosts);
};