import path from 'path';
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					"$dynamic": path.resolve("./dynamic")
				}
			}
		}
	}
};

/* 
	"$dynamic": ["../dynamic"],
	"$dynamic/*": ["../dynamic/*"]
*/