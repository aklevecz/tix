// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {
		// }
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
				R2: R2Bucket;
				tixKV: KVNamespace;
				baomem: KVNamespace;
				MESSENGER_QUEUE: Queue;
				AUTH_SERVICE: Auth;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
	interface Window {
		Square?: any;
	}
}

export {};
