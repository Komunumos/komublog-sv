<!-- BabbleEditor.svelte -->
<script lang="ts">
	import {
		dataURItoBlob,
		getResizeDimensions,
		loadImage,
		readFileAsDataURL
	} from '$lib/imageUtils';
	import { currentUser, pb } from '$lib/pocketbase';
	import ImageResize from 'image-resize';
	import EasyMDE from './ClientOnlyEasyMDE.svelte';

	let babble = '';
	let images: string[] = [];

	async function handleSubmit(): Promise<void> {
		if (babble.trim().length > 0 && babble.length <= 300 && $currentUser?.id) {
			babble = babble.trim();
			babble = await replaceUsernamesWithLinks(babble);

			const formData = new FormData();
			formData.append('author', $currentUser?.id);
			formData.append('babble', babble);

			images.forEach((image: string) => {
				formData.append('images', dataURItoBlob(image));
			});

			await pb.collection('posts').create(formData);
			babble = '';
			images = [];
		}
	}

	async function replaceUsernamesWithLinks(babble: string): Promise<string> {
		const usernames = getUsersFromBabble(babble);
		const usersView = await getUsersViewByUsernames(usernames);

		usernames.forEach((username: string) => {
			const user = usersView.find((u) => u === username);
			if (user) {
				const link = `[@${username}](/@${username})`;
				babble = babble.replace(new RegExp(`@${username}`, 'g'), link);
			}
		});

		return babble;
	}

	function getUsersFromBabble(babble: string): string[] {
		const regex = /@(\w+)(?=[\s\n]|$)/g;
		const matches: string[] = [];
		let match: RegExpExecArray | null;
		while ((match = regex.exec(babble))) {
			matches.push(match[1]);
		}
		return matches;
	}

	async function getUsersViewByUsernames(usernames: string[]): Promise<string[]> {
		const filter = generateFilterFromUsernames(usernames);
		const usersView = await pb
			.collection('usersView')
			.getList<{ username: string }>(1, 50, { filter });
		return usersView.items.map((u) => u.username);
	}

	function generateFilterFromUsernames(usernames: string[]): string {
		const filter = usernames.map((username: string) => `username = "${username}"`).join(' || ');
		return filter;
	}

	async function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const giveMeLoveNotPromises = Array.from(input.files)
				.slice(0, 4)
				.map(async (f) => {
					const dataURL = await readFileAsDataURL(f);
					const image = await loadImage(dataURL);

					const { width, height } = getResizeDimensions(image.width, image.height);
					const imageResize = new ImageResize({ width, height, quality: 0.9 });
					const newImage = await imageResize.play(dataURL);
					return newImage as string;
				});
			images = await Promise.all(giveMeLoveNotPromises);
		}
	}

	function removeImage(index: number) {
		images = images.filter((_, i) => i !== index);
	}

	function chooseRandomText(): string {
		const textArray: string[] = [
			'Share your love',
			'Say something!',
			"What's on your mind?",
			"What's happening?",
			'Talk about something you love'
		];
		const randomIndex = Math.floor(Math.random() * textArray.length);
		return textArray[randomIndex];
	}

	const easyMDEOptions = {
		placeholder: chooseRandomText(),
		status: false,
		toolbar: false,
		spellChecker: false,
		forceSync: true,
		maxLength: 300,
		maxHeight: '150px',
		promptURLs: false
	};
</script>

<form on:submit|preventDefault={handleSubmit}>
	<EasyMDE bind:value={babble} options={easyMDEOptions} {handleSubmit} />

	<div class="image-preview-container">
		{#each images as image, index}
			<div class="image-preview">
				<img src={image} alt="Babble images" />
				<span class="delete-image" on:keyup={() => {}} on:click={() => removeImage(index)}>✖</span>
			</div>
		{/each}
	</div>
	<div class="flex-container">
		<div>
			<p class="babble-count">Remaining characters: {300 - babble.length}</p>
			<div class="button-container">
				<label class="image-button">
					<span role="img" aria-label="Add images">📷</span>
					<input type="file" accept="image/*" multiple on:change={handleImageChange} hidden />
				</label>
				<button
					class="babble-button"
					type="submit"
					disabled={babble.trim().length === 0 || babble.length > 300}>Babble</button
				>
			</div>
		</div>
	</div>
</form>

<style>
	form {
		width: 100%;
	}

	.flex-container {
		display: flex;
		justify-content: flex-end;
	}

	.button-container {
		display: flex;
		flex-direction: row;
	}

	.babble-count {
		margin-bottom: 0.2rem;
		font-size: 0.875rem;
		color: #666;
	}

	.babble-button {
		width: 100%;
	}

	.image-button {
		display: inline-block;
		margin-right: 1rem;
		cursor: pointer;
		font-size: 2.5rem;
	}

	.image-preview-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1rem;
	}

	.image-preview {
		position: relative;
		width: 100px;
		height: 100px;
		border-radius: 8px;
		overflow: hidden;
	}

	.image-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.delete-image {
		position: absolute;
		top: 5px;
		right: 10px;
		color: #444;
		border: none;
		border-radius: 50%;
		font-size: 1rem;
		width: 20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		cursor: pointer;
	}
</style>
