<script lang="ts">
	import { babbleStore } from '../stores/babbleStore';
	import type { Babble } from '../types/babble';
	import BabblePost from './BabbleCard.svelte';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let limit = Infinity; // set the maximum number of babbles to display
	export let filter: (babble: Babble) => boolean = () => true; // set the filter function for babbles
</script>

<ul class="babble-list">
	{#if $babbleStore}
		{#each $babbleStore.filter(filter).slice(0, limit) as babble (babble.id)}
			<li animate:flip out:fade in:fly={{x: 500}} class="babble-list">
				<BabblePost {babble} />
			</li>
		{/each}
	{:else}
		<p aria-busy="true">Loading...</p>
	{/if}
</ul>

<style>
	.babble-list {
		list-style: none !important;
		padding: 0;
	}
</style>
