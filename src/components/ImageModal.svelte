<script lang="ts">
	import { browser } from '$app/environment';
	import { getImageUrl } from '$lib/imageUtils';

	let imageOpen: boolean | null = null;
	let image: string | null = null;
	function closeModal() {
		if (browser) {
			history.replaceState(null, '', '#');
			image = null;
			imageOpen = null;
		}
	}

	function closeOnEsc(event: KeyboardEvent) {
		if (event.code === 'Escape' || event.code === 'Esc') {
			closeModal();
		}
	}

    function loadImage() {
			const locationParts = window.location.hash.split('/');
			if (locationParts.length === 5 && locationParts[1] === 'image') {
				image = getImageUrl(locationParts[2], locationParts[3], locationParts[4]);
				imageOpen = true;
			} else {
				image = null;
				imageOpen = null;
			}
		}

	if (browser) {
		window.onpopstate = loadImage;
        loadImage();
	}

	$: {
		if (browser && imageOpen) {
			document.addEventListener('keydown', closeOnEsc);
		} else if (browser) {
			document.removeEventListener('keydown', closeOnEsc);
		}
	}
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

	dialog > article {
		overflow-y: hidden;
	}
</style>
