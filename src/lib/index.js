import { dev } from '$app/environment';

export const isDev = dev;

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
export const locations = {
	faight: {
		name: 'the faight collective',
		address: '473A Haight St, San Francisco, CA 94117',
		lat: 37.77207313781259,
		lng: -122.42997725035403
	}
};

export const colors = {
	faightOrange: '#ff764f',
	faightYellow: '#ffda4e'
};

/** @type {Product} */
const raptorFaight2 = {
	id: 'raptor-faight-2',
	projectId: 'raptor-faight-2',
	productType: 'ticket',
	name: 'ticket',
	cartTitle : 'Bazaar ~ May 2nd',
	title: `<img class="h-10 w-30" src="/raptor/bazaar/bazaar-text.svg" alt="raptor logo" /> <div>SAN FRANCISCO</div>  <div class="mt-[-12px] md:mt-0">May 2nd ~ 7pm - Midnight</div> `,
	description: /*html*/ `<div class="text-lg">DJs / Interactive art / Vinyl Swap</div>  <p>Out beyond ideas of wrongdoing and rightdoing, there is a bazaar, I’ll meet you there 🫂</p> 
<p>A place to connect with those who love sharing the gift of music & dancing 🎶</p>
<p>A place where you come as you are and find others who reflect your vibrancy 🌸</p>
<p>A place to give into curiosity and let go of expectations ✨</p>
<p>A place to enter with an open heart and mind to meet new people 💕</p>
<p>Music by <a target="_blank" class="text-[var(--third-color)]" href="https://soundcloud.com/krgmp3">krg</a>, <a class="text-[var(--third-color)]" href="https://soundcloud.com/3kelves" target="_blank">3kelves</a>, DAZL. More TBA</p>`,
	place: locations.faight,
	price: 1000,
	priceConfig: {
		base: 1000,
		slidingScale: true,
		min: 1000,
		max: 5000,
		step: 500
	},
	date: '2025-05-02',
	dates: ['2025-05-02'],
	img: '/raptor/bazaar/bazaar_laazers.jpg',
	theme: {
		primaryColor: '#afdf33',
		secondaryColor: 'black',
		thirdColor: '#f65858'
	},
	seo: {
		title: 'BAZAAR - may 2nd',
		description: 'BAZAAR - DJs / Interactive art / Vinyl Swap',
		image: '/raptor/bazaar/bazaar_promo_square_brighter.jpg'
	}
};

const cheaperRaptorPrice = 500;
const cheaperRaptorPriceConfig = {
	base: cheaperRaptorPrice,
	slidingScale: true,
	min: cheaperRaptorPrice,
	max: 2000,
	step: 250
};

const raptorFaight2Cheaper = {
	...raptorFaight2,
	id: 'r4pt0rz',
	price: cheaperRaptorPrice,
	priceConfig: cheaperRaptorPriceConfig
};
// Should rename this
/** @type {Product[]} */
export const mockProducts = [
	{
		id: 'literally-underground-1',
		projectId: 'literally-underground',
		productType: 'ticket',
		name: 'ticket',
		title: 'Literally Underground',
		cartTitle: 'Literally Underground',
		description: `San Francisco's underground music discovery night - Sun Casino, Honey Bucket, Loon`,
		place: locations.faight,
		price: 1500,
		priceConfig: {
			base: 1500,
			slidingScale: false,
			min: 100,
			max: 5000,
			step: 500
		},
		date: '2025-03-14',
		dates: ['2025-03-14'],
		img: '/images/literally-underground/1/image.png',
		theme: {
			primaryColor: colors.faightOrange,
			secondaryColor: colors.faightYellow,
			thirdColor: 'white'
		},
		seo: {
			title: 'Literally Underground | The Faight Collective',
			description: `The Faight Collective presents San Francisco's underground music discovery night - Sun Casino, Honey Bucket, Loon`,
			image: '/images/literally-underground/1/image.png'
		}
	},
	raptorFaight2,
	raptorFaight2Cheaper
];

export const validEventNames = mockProducts.map((p) => p.id);

export const responses = {
	CODE_SENT: 'Code sent',
	AUTHED: 'Authenticated',
	CODE_INVALID: 'Code invalid',
	UNKNOWN_AUTH_ERROR: 'Unknown auth error',
	LOGGED_OUT: 'Logged out'
};

export const EVENT_ID = 'raptor-faight-2';
