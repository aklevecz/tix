import logger from '$lib/logging';

/**
 * Creates a SvelteKit hook for capturing query parameter telemetry
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.paramsToTrack - The query parameter name(s) to track
 * @returns {import('@sveltejs/kit').Handle} - A SvelteKit handle function
 */
export function createTelemetryHandle({ paramsToTrack }) {
	const paramsList = Array.isArray(paramsToTrack) ? paramsToTrack : [paramsToTrack];

	return async ({ event, resolve }) => {
		const ctx = event.platform?.context;

		for (const param of paramsList) {
			const paramValue = event.url.searchParams.get(param);

			if (paramValue) {
				// Format the log in a structured way that BetterStack can parse effectively
				try {
					const telemetryData = {
						event_type: 'query_param_telemetry',
						param_name: param,
						param_value: paramValue,
						path: event.url.pathname,
						timestamp: new Date().toISOString(),
						user_agent: event.request.headers.get('user-agent'),
						referer: event.request.headers.get('referer') || 'direct'
					};

					// Use a consistent format that BetterStack can parse
                    // @ts-ignore
					logger(ctx).info(`TELEMETRY_EVENT ${JSON.stringify(telemetryData)}`);
				} catch (error) {
					console.error('Failed to log telemetry:', error);
				}
			}
		}

		return await resolve(event);
	};
}
