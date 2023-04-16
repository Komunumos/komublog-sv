<script lang="ts">
	import type { Babble } from '../types/babble';
	import BabblePost from './BabbleCard.svelte';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';

	export let babbles: Babble[];
	export let hasMore: boolean;
	export let loadPage: () => Promise<{ babbles: Babble[]; hasMore: boolean }>;

	let observer: IntersectionObserver;
	onMount(() => {
		observer = new IntersectionObserver(
			async (entries: IntersectionObserverEntry[]) => {
				if (entries[0].isIntersecting) {
					const pageResult = await loadPage();

					const rawBabbles = [...babbles, ...pageResult.babbles];
					const babblesMap = new Map();
					for (const babble of rawBabbles) {
						if (!babblesMap.has(babble.id)) {
							babblesMap.set(babble.id, babble);
						}
					}

					babbles = Array.from(babblesMap.values());
					hasMore = pageResult.hasMore;
					console.log('hasMore', hasMore);
				}
			},
			{ threshold: 1 }
		);
	});

	function observeSentinel(node: HTMLDivElement) {
		observer.observe(node);

		return {
			destroy() {
				observer.unobserve(node);
			}
		};
	}

	let sentinel: HTMLDivElement | null;
	$: if (sentinel) {
		observer.observe(sentinel);
		sentinel = null;
	}
</script>

<ul class="babble-list">
	{#if babbles}
		{#each babbles as babble (babble.id)}
			<li animate:flip out:fade in:fade class="babble-list">
				<BabblePost {babble} />
			</li>
		{/each}
	{:else}
		<p aria-busy="true">Loading...</p>
	{/if}
	{#if hasMore}
		<div bind:this={sentinel} class="sentinel" />
	{/if}
</ul>

<style>
	.babble-list {
		list-style: none !important;
		padding: 0;
	}
</style>
