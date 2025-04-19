import dbOrders from '$lib/db/orders';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({cookies, url, platform }) {
	if (!platform) {
		throw error(500, 'Platform not found');
	}
	const paymentIntentId = url.searchParams.get('payment_intent');
	const squareOrderId = url.searchParams.get('square_order_id');
	let orderId = paymentIntentId || squareOrderId;

	const generate = cookies.get('generate');
	cookies.delete('generate', { path: '/' });
	/** @type {TixOrder | null} */
	let order = null;
	if (orderId) {
		order = (await dbOrders(platform?.env.DB).getOrder(orderId));
		console.log(`receipt for ${orderId}`)
	}
	return { paymentIntentId, order, generate };
}
