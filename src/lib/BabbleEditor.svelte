<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let babble = '';
	const dispatch = createEventDispatcher();

	function handleSubmit() {
		if (babble.length > 0 && babble.length <= 280) {
			dispatch('babble', { text: babble });
			babble = '';
		}
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
    placeholder="{chooseRandomText()}"
		bind:value={babble}
		rows="4"
		cols="50"
		maxlength="300"
	/>
	<div class="flex-container">
		<div>
			<p class="babble-count">Remaining characters: {300 - babble.length}</p>
			<button
				class="babble-button"
				type="submit"
				disabled={babble.length === 0 || babble.length > 300}>Babble</button
			>
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

	.babble-count {
		margin-bottom: 0.2rem;
		font-size: 0.875rem;
		color: #666;
	}

	.babble-button {
		width: 100%;
	}
</style>
