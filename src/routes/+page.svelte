<script lang="ts">
	import { currentUser, pb } from '../lib/pocketbase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BabbleEditor from '../lib/BabbleEditor.svelte';

	let redirect = () => {};

	$: {
		if (!$currentUser) {
			redirect();
		}
	}

	// goto is set under onmount to avoid server redirects
	onMount(() => {
		redirect = () => {
			goto('/sign-up');
		};
	});
</script>

{#if $currentUser}
	<div><BabbleEditor /></div>
{/if}
