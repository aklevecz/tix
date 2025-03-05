import dbOrders from '$lib/db/orders';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({cookies, url, platform }) {
	const paymentIntentId = url.searchParams.get('payment_intent');
	const squareOrderId = url.searchParams.get('square_order_id');
	let orderId = paymentIntentId || squareOrderId;

	const generate = cookies.get('generate');
	cookies.delete('generate', { path: '/' });
	/** @type {TixOrder | null} */
	let order = null;
	if (orderId) {
		order = (await dbOrders(platform?.env.DB).getOrder(orderId));
		console.log(order)
	}
	return { paymentIntentId, order, generate };
}
