export const checkoutActions = {
	CREATE_INTENT: 'CREATE_INTENT',
	ORDER_CONFIRMED: 'ORDER_CONFIRMED',
	ORDER_FAILED: 'ORDER_FAILED'
};

/**
 * Gets the cart from cookies, or creates a new one if it doesn't exist.
 *
 * @param {object} params
 * @param {import('@sveltejs/kit').Cookies} params.cookies
 * @param {object} params.defaultCart
 * @returns {Cart} The cart object.
 */
export function getOrCreateCart({ cookies, defaultCart }) {
	let cartSession = cookies.get('cart');
	let cart;

	if (!cartSession) {
		cart = { ...defaultCart, id: crypto.randomUUID() };
		// Save the default cart (could also save the new one with the new id)
		cookies.set('cart', JSON.stringify(cart), {
			path: '/',
			httpOnly: false,
			maxAge: 60 * 60 * 24 * 30
		});
	} else {
		cart = JSON.parse(cartSession);
	}
	return cart;
}

export const collectCookies = () => {
	/** @type {Record<string, string>} */
	const cookies = document.cookie.split('; ').reduce((acc, curr) => {
		const [key, value] = curr.split('=');
		acc[key] = decodeURIComponent(value);
		return acc;
	}, /** @type {Record<string, string>} */ ({}));

	return { cartSession: cookies.cart ? JSON.parse(decodeURIComponent(cookies.cart)) : null };
};
