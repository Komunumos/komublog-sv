import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';
import type { ListResult } from 'pocketbase';
import type { Babble } from '../../types/babble';
import type { RouteParams } from './$types';

export const load = async ({ params }: { params: RouteParams }) => {
	const users = await pb.collection('usersView').getFullList();
  const user = users.filter(u => u.username === params.user)[0]
	if (!user) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const posts: ListResult<any> = await pb.collection('postsView').getList(1, 50, {
		filter: `username = "${params.user}"`
	});

	const babblePosts = posts.items.map((i) => {
		const b: Babble = { ...i };
		return b;
	});
	return {
		user: { id: user.id, username: user.username, name: user.name, avatar: user.avatar},
		posts: babblePosts
	};
};
