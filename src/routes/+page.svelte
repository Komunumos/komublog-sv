<script lang="ts">
	import { currentUser, pb } from '../lib/pocketbase';
	import BabbleEditor from '@components/BabbleEditor.svelte';
	import BabbleList from '@components/BabbleList.svelte';
	import type { PageData } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import type { Babble } from '@models/babble';

	export let data: PageData;
	let unsubscribe: () => void;

	let babbles: Babble[] = data.babbles;
	onMount(async () => {
		await pb.collection('posts').unsubscribe('*');
		if (!unsubscribe) {
			unsubscribe = await pb.collection('posts').subscribe('*', async ({ action, record }) => {
				if (action === 'create') {
					var babble = await pb.collection('postsView').getOne<Babble>(record.id);
					babbles = [babble, ...babbles];
				} else if (action === 'delete') {
					babbles = [...babbles.filter((b) => b.id !== record.id)];
				}
			});
		}
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
		<div>
			<span>Sign up to start posting.</span>&nbsp;&nbsp;&nbsp;&nbsp;<a role="button" href="/sign-up"
				>Sign up</a
			>
		</div>
		<br /><!--  br goes broooom! -->
		<small><span>Already have an account?</span>&nbsp;<a href="/sign-in">Sign In</a></small>
	</article>
{/if}
<BabbleList babbles={[...babbles]} hasMore={data.hasMore} loadNextPage={data.loadNextPage} />
