import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';
import type { ListResult } from 'pocketbase';
import type { Babble } from '../../types/babble';
import type { RouteParams } from './$types';

export const load = async ({ params }: { params: RouteParams }) => {
  console.log('loading user')

	const posts: ListResult<any> = await pb.collection('postsView').getList(1, 50, {
		filter: `username = '${params.user}'`
	});

	const babblePosts = posts.items.map((i) => {
		const b: Babble = { ...i };
		return b;
	});
	return {
		user: params.user,
		posts: babblePosts
	};
};
