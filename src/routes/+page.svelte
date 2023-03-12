<script lang="ts">
	import { currentUser, pb } from '../lib/pocketbase';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import BabbleEditor from '../lib/BabbleEditor.svelte';
	import BabbleList from '$lib/BabbleList.svelte';
	import type { Babble } from '../types/babble';
	import { babbleStore } from '../stores/babbleStore';
	
	let redirect = () => {};
	let unsubscribe: () => void;
	
	$: {
		if (!$currentUser) {
			redirect();
		}
	}

	onMount(async () => {
		await pb.collection('posts').unsubscribe('*');
		unsubscribe = await pb.collection('posts').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				var post: any = await pb.collection('postsView').getOne(record.id);
				var babble: Babble = { ...post };
				babbleStore.update(babbles => [babble, ...babbles])
			} else if (action === 'delete') {
				babbleStore.update(babbles => [...babbles.filter(b => b.id !== record.id)])
			}
		});

		// goto is set under onmount to avoid server redirects
		redirect = () => {
			goto('/sign-up');
		};
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

{#if $currentUser}
	<div><BabbleEditor /></div>

	<BabbleList />
{/if}
