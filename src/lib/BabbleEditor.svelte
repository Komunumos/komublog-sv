<script lang="ts">
	import { dataURItoBlob, getResizeDimensions, loadImage, readFileAsDataURL } from './imageHelper';
	import { currentUser, pb } from './pocketbase';
	import ImageResize from 'image-resize';

	let babble = '';
	let images: string[] = [];

	async function handleSubmit() {
		if (babble.length > 0 && babble.length <= 300 && $currentUser?.id) {
			const formData = new FormData();
			formData.append('author', $currentUser?.id);
			formData.append('babble', babble);

			images.forEach((image) => {
				formData.append('images', dataURItoBlob(image));
			});

			await pb.collection('posts').create(formData);
			babble = '';
			images = [];
		}
	}

	async function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const giveMeLoveNotPromises = Array.from(input.files)
				.slice(0, 4)
				.map(async (f) => {
					const dataURL = await readFileAsDataURL(f);
					const image = await loadImage(dataURL);

					let imageResize = new ImageResize(getResizeDimensions(image.width, image.height));
					let newImage = await imageResize.play(dataURL);
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
</script>

<form on:submit|preventDefault={handleSubmit}>
	<!-- <label class="label" for="babble-textarea">Compose your babble:</label> -->
	<textarea
		id="babble-textarea"
		class="textarea"
		placeholder={chooseRandomText()}
		bind:value={babble}
		rows="4"
		cols="50"
		maxlength="300"
	/>
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
					disabled={babble.length === 0 || babble.length > 300}>Babble</button
				>
			</div>
		</div>
	</div>
</form>

<style>
	form {
		width: 100%;
	}
	textarea {
		margin-bottom: 0;
		resize: none;
		border: 1px solid #ccc;
		font-size: 1rem;
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
