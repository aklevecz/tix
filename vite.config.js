import { sentrySvelteKit } from '@sentry/sveltekit';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'yaytso',
				project: 'tix'
			}
		}),
		sveltekit(),
		tailwindcss()
	],
	server: {
		allowedHosts: ['local-tix.yaytso.art', 'tix.concertraptors.com']
	}
});
