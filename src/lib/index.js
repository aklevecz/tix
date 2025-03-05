import { dev } from '$app/environment';

export const isDev = true;

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

/** @type {Record<string, Locale>} */
const locations = {
	faight: {
		name: 'the faight collective',
		address: '473A Haight St, San Francisco, CA 94117',
		lat: 37.77207313781259,
		lng: -122.42997725035403
	}
};

/** @type {Product[]} */
export const mockProducts = [
	{
		id: 'literally-underground-1',
		projectId: 'literally-underground',
		productType: 'ticket',
		name: 'ticket',
		title: 'Literally Underground',
		description: `San Francisco's underground music discovery night - Sun Casino, Honey Bucket, Loon`,
		place: locations.faight,
		price: 1500,
		priceConfig: {
			base: 1500,
			slidingScale: true,
			min: 100,
			max: 5000,
			step: 500
		},
		date: '2025-03-14',
		dates: ['2025-03-14'],
		img: '/images/literally-underground/1/image.png'
	},
	{
		id: 'raptor-faight-2',
		projectId: 'raptor-faight-2',
		productType: 'ticket',
		name: 'ticket',
		title: 'Raptor Faight 2',
		description: 'A ticket to the concert raptors takeover at the faight part 2',
		place: locations.faight,
		price: 1500,
		priceConfig: {
			base: 1500,
			slidingScale: true,
			min: 100,
			max: 5000,
			step: 500
		},
		date: '2025-05-02',
		dates: ['2025-05-02'],
		img: '/images/ticket.png'
	}
];

export const responses = {
	CODE_SENT: 'Code sent',
	AUTHED: 'Authenticated',
	CODE_INVALID: 'Code invalid',
	UNKNOWN_AUTH_ERROR: 'Unknown auth error',
	LOGGED_OUT: 'Logged out'
};

export const EVENT_ID = 'raptor-faight-2';
