<script>
	import { goto } from '$app/navigation';
	import config from '../config';
	import { currentUser, pb } from '../lib/pocketbase';

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
			<li>Hello {$currentUser.username}!</li>
			<li><button class="outline config-button" on:click={goToConfig}>⚙</button></li>
			<li><button on:click={signOut}>Log out</button></li>
		</ul>
	{/if}
</nav>

{#if $currentUser}
	<div />
{/if}

<main class="container">
	<slot />
</main>

<style>
	nav {
		margin: 0 15px 0 15px;
	}

	img.logo {
		margin-right: 5px;
	}

	a.logo {
		text-decoration: none;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
	}
</style>
