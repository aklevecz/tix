import dbOrders from '$lib/db/orders';
import dbFreebees from '$lib/db/freebees';
import dbSharebees from '$lib/db/sharebees';

/** @type {import('./$types').PageServerLoad} */
export async function load({ platform }) {
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