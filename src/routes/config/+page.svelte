<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAvatar100 } from '$lib/avatarHelper';
	import { resizeThenCrop, dataURItoBlob, readFileAsDataURL, loadImage } from '$lib/imageHelper';
	import { currentUser, pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';

	let name = '';
	let avatarUrl = '';
	let file = '';
	let errorMessage = '';
	let loading = true;
	let resizedSrc = '';

	let redirect = () => {};
	$: {
		if (!$currentUser) {
			redirect();
		}
	}

	async function handleImageChange(event: any) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		const dataURL = await readFileAsDataURL(file)
		const image = await loadImage(dataURL);
		const resizedImage = await resizeThenCrop(image);
		resizedSrc = resizedImage;
	}

	async function handleUpdateProfile() {
		if ($currentUser?.id) {
			try {
				const formData = new FormData();
				formData.append('name', name);

				if (file && resizedSrc) {
					formData.append('avatar', dataURItoBlob(resizedSrc));
				}await pb.collection('users').update($currentUser?.id, formData);
				goto('/');
			} catch (error) {
				console.log(error);
			}
		}
	}

	onMount(async () => {
		name = $currentUser?.name;
		if ($currentUser?.id) {
			const user = await pb.collection('users').getOne($currentUser?.id);
			name = user.name;
			avatarUrl = getAvatar100(user.id, user.avatar);
		}
		loading = false;

		redirect = () => {
			goto('/sign-up');
		};
	});
</script>

<h2>Configuration</h2>
{#if errorMessage}
	<div class="alert">{errorMessage}</div>
{/if}
{#if loading}
	<div aria-busy="true" />
{:else}
	<article>
		<form on:submit|preventDefault={handleUpdateProfile}>
			<div>
				<div>
					<label for="nameInput">Name:</label>
					<input type="text" id="nameInput" bind:value={name} />
				</div>
			</div>
			<div>
				<div>
					<label for="avatarInput">Avatar:</label>
					<input
						type="file"
						id="fileInput"
						accept="image/*"
						bind:value={file}
						on:change={handleImageChange}
					/>
				</div>
				<div class="group">
					<img
						src={avatarUrl}
						alt="Avatar"
						width="100"
						height="100"
						class:class={resizedSrc ? 'greyed-out' : ''}
					/>
					{#if resizedSrc}
						<span>➡</span>
						<img src={resizedSrc} alt="New avatar" style="width: 100px; height: 100px; object-fit: contain;" />
					{/if}
				</div>
			</div>

			<button type="submit">Save</button>
		</form>
	</article>
{/if}

<style>
	article {
		margin-right: 15%;
		margin-left: 15%;
	}
	h2 {
		margin-bottom: 20px;
	}

	form div {
		margin-bottom: 10px;
	}

	label {
		display: block;
		margin-bottom: 5px;
	}

	input[type='text'],
	input[type='file'] {
		border: none;
		border-radius: 3px;
		padding: 5px;
		width: 100%;
	}

	input[type='file'] {
		padding: 0;
	}

	img {
		border-radius: 50%;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
		margin-bottom: 10px;
	}

	.group {
		display: flex;
		flex-direction: row;
	}

	.greyed-out {
		filter: grayscale(50%);
	}
</style>
