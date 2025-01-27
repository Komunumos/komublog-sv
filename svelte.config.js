import adapter from '@sveltejs/adapter-node';
import sveltePreprocess from 'svelte-preprocess'; // Using svelte-preprocess instead of vitePreprocess

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Use sveltePreprocess for preprocessor support
	preprocess: sveltePreprocess(),

	kit: {
		// Use adapter-node as specified
		adapter: adapter(),

		// Aliases for clean imports
		alias: {
			'@components': './src/components',
			'@models': './src/models'
		}
	}
};

export default config;
