import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';
import type { RouteParams } from './$types';
import { loadBabblesPage } from '$lib/postsService';

export const load = async ({ params }: { params: RouteParams }) => {
	console.log('loading user page')
	const users = await pb.collection('usersView').getFullList();
	const user = users.filter((u) => u.username === params.user)[0];
	if (!user) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const { babbles, hasMore } = await loadBabblesPage(1, `username = "${params.user}"`)

	return {
		user: { id: user.id, username: user.username, name: user.name, avatar: user.avatar },
		babbles,
		hasMore,
		loadBabblesPage
	};
};
