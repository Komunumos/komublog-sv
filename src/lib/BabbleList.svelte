<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { babbleStore } from '../stores/babbleStore';
	import type { Babble } from '../types/babble';
	import BabblePost from './BabbleCard.svelte';
	import { pb } from './pocketbase';


	export let limit = Infinity; // set the maximum number of babbles to display
	export let filter: (babble: Babble) => boolean = () => true; // set the filter function for babbles
</script>

<ul class="babble-list">
	{#if $babbleStore}
		{#each $babbleStore.filter(filter).slice(0, limit) as babble}
			<li>
				<BabblePost {babble} />
			</li>
		{/each}
	{:else}
		<p aria-busy="true">Loading...</p>
	{/if}
</ul>

<style>
	.babble-list {
		list-style: none;
		padding: 0;
	}
</style>
