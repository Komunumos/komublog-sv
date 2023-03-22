<script lang="ts">
	import { getAvatar300 } from '$lib/avatarHelper';
	import BabbleList from '$lib/BabbleList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<article>
	{#if data.user.avatar}
		<img class="avatar" src={getAvatar300(data.user.id, data.user.avatar)} alt="Author Avatar" />
	{:else}
		<img class="avatar" src="https://via.placeholder.com/300x300" alt="Author Avatar" />
	{/if}
	<hgroup>
		<h1>{data.user.username}</h1>
		<h2>{data.user.name}</h2>
	</hgroup>
</article>

<BabbleList babbles={data.posts} />

<style>
	img.avatar {
		border-radius: 50%;
    max-width: 200px;
	}
</style>
