import dbOrders from '$lib/db/orders';
import dbFreebees from '$lib/db/freebees';
import dbSharebees from '$lib/db/sharebees';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ platform, url }) {
	let ok = false;
	const teemo = url.searchParams.get('teemo');
	if (teemo === 'meepo') {
		ok = true;
	}

	const pw = 'AKJSDKJASDKJHASJKDHJKAHSDJKHASDKJh'

	const ghoj = url.searchParams.get('ghoj');
	if (ghoj === pw) {
		ok = true;
	}

	if (!ok) {
		throw error(404, 'whart?');
	}
	if (!platform?.env?.DB) {
		console.error('Database binding DB not found.');
		return {
			orders: [],
			freebees: [],
			sharebees: []
		};
	}

	const ordersDb = dbOrders(platform.env.DB);
	const freebeesDb = dbFreebees(platform.env.DB);
	const sharebeesDb = dbSharebees(platform.env.DB);

	try {
		const [orders, freebees, sharebees] = await Promise.all([
			ordersDb.getAllOrders(),
			freebeesDb.getAllFreebees(),
			sharebeesDb.getAllSharebees()
		]);

		return {
			orders,
			freebees,
			sharebees
		};
	} catch (error) {
		console.error('Error loading admin data:', error);
		return {
			orders: [],
			freebees: [],
			sharebees: [],
			error: 'Failed to load data'
		};
	}
}
