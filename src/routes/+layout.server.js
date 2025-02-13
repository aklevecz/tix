import { getOrCreateCart } from '$lib';
import { defaultCart } from '$lib/stores/cart.svelte';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, url, locals }) {
	const cart = getOrCreateCart({ cookies, defaultCart });
	return { cart };
}
