import { getOrCreateCart, mockProducts } from '$lib';
import { defaultCart } from '$lib/stores/cart.svelte';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, url, locals }) {
	const cart = getOrCreateCart({ cookies, defaultCart });
	const userSession = JSON.parse(cookies.get('user') || "{}")
	const token = cookies.get('token') || ""
	return { cart, user: userSession, products: mockProducts, token };
}
