<script>
	import { goto } from '$app/navigation';
	import ImageModal from '@components/ImageModal.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { fade } from 'svelte/transition';

	function goToConfig() {
		goto('/config');
	}

	async function signOut() {
		pb.authStore.clear();
	}
</script>

<nav>
	<ul>
		<li>
			<a class="logo" href="/">
				<img class="logo" src="/ghost.png" alt="Komublog Logo" width="30" /><strong>Komublog</strong
				>
			</a>
		</li>
	</ul>
	{#if $currentUser}
		<ul>
			<li>Hello <span on:keydown={() => {}} on:click={() => goto(`@${$currentUser?.username}`)}>@{$currentUser.username}</span>!</li>
			<li><button class="outline config-button" on:click={goToConfig}>⚙</button></li>
			<li><button on:click={signOut}>Log out</button></li>
		</ul>
	{/if}
</nav>

{#if $currentUser}
	<div />
{/if}

<main class="container" transition:fade>
	<slot />
</main>

<ImageModal />

<style>
	nav {
		margin: 0 15px 0 15px;
	}

	img.logo {
		margin-right: 5px;
		margin-bottom: 7px;
	}

	a.logo {
		text-decoration: none;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		vertical-align: middle;
	}
</style>
