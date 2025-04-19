import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_ENDPOINT } from '$env/static/public';
import { dev } from '$app/environment';

Sentry.init({
	dsn: PUBLIC_SENTRY_ENDPOINT,
	environment: dev ? 'development' : 'production',
	tracesSampleRate: 1
});

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	const response = await resolve(event);
	return response;
});
export const handleError = Sentry.handleErrorWithSentry();
