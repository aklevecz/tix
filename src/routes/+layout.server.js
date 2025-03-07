import { EVENT_ID, getOrCreateCart, mockProducts } from '$lib';
import { defaultCart } from '$lib/stores/cart.svelte';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, url, locals, params }) {
	const cart = getOrCreateCart({ cookies, defaultCart });
	const userSession = JSON.parse(cookies.get('user') || '{}');
	const token = cookies.get('token') || '';

	let currentEvent = cookies.get('event') || EVENT_ID;
	if (params.eventName) {
		currentEvent = params.eventName;
		cookies.set('event', currentEvent, {
			path: '/',
			httpOnly: false,
			maxAge: 60 * 60 * 24 * 30
		});
	}
	const featured = mockProducts.find((p) => p.id === currentEvent);
	return { cart, user: userSession, products: mockProducts, token, featured: featured };
}
