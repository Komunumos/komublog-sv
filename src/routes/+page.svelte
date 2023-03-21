<script lang="ts">
	import { currentUser, pb } from '../lib/pocketbase';
	import { onDestroy, onMount } from 'svelte';
	import BabbleEditor from '../lib/BabbleEditor.svelte';
	import BabbleList from '$lib/BabbleList.svelte';
	import type { Babble } from '../types/babble';
	import { babbleStore } from '../stores/babbleStore';

	let unsubscribe: () => void;

	onMount(async () => {
		await pb.collection('posts').unsubscribe('*');
		unsubscribe = await pb.collection('posts').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				var post: any = await pb.collection('postsView').getOne(record.id);
				var babble: Babble = { ...post };
				babbleStore.update((babbles) => [babble, ...babbles]);
			} else if (action === 'delete') {
				babbleStore.update((babbles) => [...babbles.filter((b) => b.id !== record.id)]);
			}
		});
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<svelte:head>
	<title>Komublog</title>
</svelte:head>

{#if $currentUser}
	<div><BabbleEditor /></div>
{:else}
	<article>
		<div><span>Sign up to start posting.</span>&nbsp;&nbsp;&nbsp;&nbsp;<a role="button" href="/sign-up">Sign up</a></div>
		<br /><!--  br goes broooom! -->
		<small><span>Already have an account?</span>&nbsp;<a href="/sign-in">Sign In</a></small>
	</article>
{/if}
<BabbleList />
