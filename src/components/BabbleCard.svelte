<script lang="ts">
	import BabbleEditor from './BabbleEditor.svelte';
	import type { Babble } from '@models/babble';
	import { getAvatar80 } from '$lib/avatarHelper';
	import { currentUser, pb } from '$lib//pocketbase';
	import { getImageUrl } from '$lib/imageUtils';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/timeHelper';
	import { marked } from 'marked';
	export let babble: Babble;

	let showReplyEditor = false;
	let deleteOpen: boolean | null = null;
	let shortDate: string;
	let date: string;

	const renderer = new marked.Renderer();
	renderer.heading = (text, level) => `${'#'.repeat(level)} ${text}`;
	renderer.link = (href, title, text) => {
		const attrs = 'target="_blank" rel="noopener noreferrer"';
		return `<a href="${href}" ${title ? `title="${title}"`: ''} ${attrs}>${text}</a>`;
	};
	marked.setOptions({ renderer, breaks: true });

	async function like() {
		let response = await pb.send(`api/like/${babble.id}`, { method: 'PUT' });
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

	function askDelete() {
		deleteOpen = true;
	}

	async function deleteBabble() {
		await pb.collection('posts').delete(babble.id);
		deleteOpen = null;
	}

	function openImageModal(image: string) {
		if (browser) {
			window.location.hash = `/image/posts/${babble.id}/${image}`;
		}
	}

	$: {
		({ shortDate, date } = formatDate(babble.postDate || ''));
	}
</script>

<article class="card" data-theme="light">
	<div class="header">
		<img
			class="avatar"
			src={babble.avatar
				? getAvatar80(babble.author, babble.avatar)
				: 'https://placehold.co/80x80'}
			alt="Author Avatar"
		/>

		<div class="info">
			<h2 on:click={() => goto(`/@${babble.username}`)} on:keydown={() => {}}>
				<a href={`/@${babble.username}`}>@{babble.username}</a>
			</h2>
			<p>{babble.name}</p>
			<a href={`/@${babble.username}/${babble.id}`}>
				<small title={date}>{shortDate}</small>
			</a>
		</div>
	</div>
	<div class="babble">
		<p>{@html marked(babble.babble)}</p>
		{#if babble.images && babble.images.length > 0}
			<figure class="images">
				{#each babble.images as image}
					<img
						class="rounded-image"
						src={`${getImageUrl('posts', babble.id, image)}?thumb=75x75`}
						alt="Babble"
						on:click={() => openImageModal(image)}
						on:keyup={() => {}}
					/>
				{/each}
			</figure>
		{/if}
	</div>
	<div class="actions">
		<button class="outline" on:click={like}>
			<span role="img" aria-label="Like">❤️</span>
			{babble.likes}
		</button>
		{#if babble.author === $currentUser?.id || $currentUser?.username === 'renato'}
			<button class="outline" on:click={askDelete}>
				<span role="img" aria-label="Delete">🗑</span>
			</button>
		{/if}
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

<dialog open={deleteOpen} data-theme="dark">
	<article>
		Do you want to delete this babble?
		<button class="outline" on:click={deleteBabble}>Yes</button>
		<button class="outline secondary" on:click={() => (deleteOpen = null)}>No</button>
	</article>
</dialog>

<style>
	a {
		color: inherit;
	}

	.avatar {
		width: 80px;
		height: auto;
	}

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

	.card .header small {
		font-size: 0.7rem;
		margin: 0;
	}

	.card .babble {
		font-size: 1.2rem;
		margin-bottom: 10px;
	}

	.card .images {
		display: flex;
		justify-content: start;
	}

	.card .images {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		white-space: nowrap;
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
		margin-bottom: 0;
	}

	.rounded-image {
		width: 75px;
		height: 75px;
		margin-right: 10px;
		object-fit: cover;
		border-radius: 8px;
		cursor: pointer;
	}
</style>
