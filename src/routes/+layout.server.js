import { EVENT_ID, getOrCreateCart, mockProducts, validEventNames } from '$lib';
import { defaultCart } from '$lib/stores/cart.svelte';

/** @param {string} eventName */
function isValidEventName(eventName) {
	return validEventNames.includes(eventName);
}

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, url, locals, params }) {
	const cart = getOrCreateCart({ cookies, defaultCart });
	const userSession = JSON.parse(cookies.get('user') || '{}');
	const token = cookies.get('token') || '';

	let currentEvent = EVENT_ID;
	console.log(params.eventName)
	if (params.eventName) {
		if (isValidEventName(params.eventName)) {
			currentEvent = params.eventName;

			cookies.set('event', currentEvent, {
				path: '/',
				httpOnly: false,
				maxAge: 60 * 60 * 24 * 30
			});
		}
	} else {
		const eventCookie = cookies.get('event');
		if (eventCookie && isValidEventName(eventCookie)) {
			currentEvent = eventCookie;
		}
	}

	const featured = mockProducts.find((p) => p.id === currentEvent);
	return { cart, user: userSession, products: mockProducts, token, featured: featured };
}
