import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from '@zerodevx/svelte-img/vite';

export default defineConfig({
	plugins: [sveltekit(), imagetools()],
	resolve: {
		alias: {
			$lib: '/src/lib'
		}
	},
	server: {
		fs: {
			allow: ['dynamic/', 'vidGenAssets/']
		}
	}
});
