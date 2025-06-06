import { sequence } from '@sveltejs/kit/hooks';
import { initCloudflareSentryHandle, sentryHandle } from '@sentry/sveltekit';
import { PUBLIC_SENTRY_ENDPOINT } from '$env/static/public';
import { dev } from '$app/environment';
import { createTelemetryHandle } from '$lib/telemetry/telemetry-handle';

export const handle = sequence(
	initCloudflareSentryHandle({
		dsn: PUBLIC_SENTRY_ENDPOINT,
		environment: dev ? 'development' : 'production',
		tracesSampleRate: 1.0
	}),
	sentryHandle(),
	createTelemetryHandle({
		paramsToTrack: 'qr'
	})
);
