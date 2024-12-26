import { sveltekit } from '@sveltejs/kit/vite';
/* import { defineConfig } from 'vite'; */
import { imagetools } from '@zerodevx/svelte-img/vite'

const defineConfig = ({
	plugins: [sveltekit(), imagetools()],
	resolve: {
		alias: {
			$lib: '/src/lib'
		}
	},
	server: {
		fs: {
			allow: [
				"dynamic/",
				"vidGenAssets/"
			]
		}
	}
});
export default defineConfig;