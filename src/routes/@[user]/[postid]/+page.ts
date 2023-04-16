import { pb } from '$lib/pocketbase';
import type { RouteParams } from './$types';
import { error } from '@sveltejs/kit';
import type { Babble } from '@models/babble';

export const load = async ({ params }: { params: RouteParams }) => {
	const babble = await pb.collection('postsView').getOne<Babble>(params.postid);

	if (!babble || babble.username != params.user) {
		throw error(404, {
			message: 'Not found'
		});
	}

	return {
		babble
	};
};
