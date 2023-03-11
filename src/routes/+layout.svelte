<script>
	import { currentUser, pb } from '../lib/pocketbase';

	async function signOut() {
		pb.authStore.clear();
	}
</script>

<nav>
	<ul>
		<li><strong>Komublog</strong></li>
	</ul>
    {#if $currentUser}
	<ul>
		<li>Hello {$currentUser.username}!</li>
		<li><button on:click={signOut}>Log out</button></li>
	</ul>
    {/if}
</nav>

{#if $currentUser}
	<div> </div>
{/if}

<main class="container">
	<slot />
</main>

<style>
    nav {
        margin: 0 15px 0 15px;
    }
</style>
