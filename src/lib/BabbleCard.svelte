<script lang="ts">
	import BabbleEditor from './BabbleEditor.svelte';
	import type { Babble } from '../types/babble';
	import { getAvatar50 } from './avatarHelper';
	import { pb } from './pocketbase';

	export let babble: Babble;

	let showReplyEditor = false;

	async function like() {
		let response = await pb.send(`api/like/${babble.id}`, {'method': 'PUT'});
		babble.likes = response.likes;
	}

	function retweet() {
		babble.reblabs++;
	}

	function share() {
		// logic for sharing post goes here
	}

	function toggleReplyEditor() {
		showReplyEditor = !showReplyEditor;
	}
</script>

<article class="card" data-theme="light">
	<div class="header">
		{#if babble.avatar}
			<img src={getAvatar50(babble.author, babble.avatar)} alt="Author Avatar" />
		{:else}
			<img src="https://via.placeholder.com/50x50" alt="Author Avatar" />
		{/if}
		<div class="info">
			<h2>@{babble.username}</h2>
			<p>{babble.name}</p>
		</div>
	</div>
	<div class="babble">
		<p>{babble.babble}</p>
		{#if babble.images && babble.images.length > 0}
			<div class="images">
				{#each babble.images as image}
					<img src={image} alt="Babble" />
				{/each}
			</div>
		{/if}
	</div>
	<div class="actions">
		<button class="outline" on:click={like}>
			<span role="img" aria-label="Like">❤️</span>
			{babble.likes}
		</button>
		<!-- <button class="outline" on:click={retweet}>
			<span role="img" aria-label="Retweet">🔄</span>
			{babble.reblabs}
		</button>
		<button class="outline" on:click={share}>
			<span role="img" aria-label="Share">📤</span>
		</button>
		<button class="outline" on:click={toggleReplyEditor}>
			<span role="img" aria-label="Reply">💬</span>
		</button> -->
	</div>
	{#if showReplyEditor}
		<BabbleEditor />
	{/if}
</article>

<style>
	.card {
		border-radius: 10px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 20px;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.card .header {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.card .header img {
		border-radius: 50%;
		margin-right: 10px;
	}

	.card .header h2 {
		font-size: 1rem;
		margin: 0;
	}

	.card .header p {
		font-size: 0.8rem;
		margin: 0;
		color: #666;
	}

	.card .babble {
		font-size: 1.2rem;
		margin-bottom: 10px;
	}

	.card .images {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 10px;
	}

	.card .actions {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-top: 10px;
	}

	.card .actions button {
		width: auto;
		border: none;
		cursor: pointer;
		font-size: 1rem;
	}
</style>
