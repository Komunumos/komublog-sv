<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { ImageEventBus } from './imageEventBus';

	let imageOpen: boolean | null = null;
	let image: string | null = null;
	let unsubscribe = () => {};

	function handleEvent(eventImage: string | null) {
		console.log(eventImage);
		imageOpen = eventImage ? true : null;
		image = eventImage;
	}

	function closeModal() {
		imageOpen = null;
		image = null;
		if (browser) {
			history.back();
		}
	}

	if (browser) {
		window.onpopstate = () => {
			if (imageOpen) {
				imageOpen = null;
			}
		};
	}

	$: {
		if (imageOpen) {
			document.onkeydown = function (event: KeyboardEvent) {
				if (event.code === 'Escape' || event.code === 'Esc') {
					closeModal();
				}
			};
		}
	}

	onMount(() => {
		unsubscribe = ImageEventBus.subscribe(({ event, image }) => {
			if (event === 'image-modal-event') {
				handleEvent(image);
			}
		});
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<dialog open={imageOpen} id="image-dialog" data-theme="dark">
	<article>
		<header>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-missing-attribute -->
			<a aria-label="Close" on:click={closeModal} class="close"> &nbsp; </a>
		</header>
		{#if image}
			<img src={image} alt="Babble" />
		{/if}
	</article>
</dialog>

<style>
	dialog > article > img {
		max-height: 80vh;
	}
	dialog > article > header {
		padding-top: 15px;
		margin-bottom: 15px;
	}

	dialog > article > header > a {
		text-decoration: none;
		color: inherit;
	}
</style>
