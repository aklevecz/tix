import dbOrders from '$lib/db/orders';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ url, platform }) {
	const paymentIntentId = url.searchParams.get('payment_intent');
	/** @type {TixOrder | null} */
	let order = null;
	if (paymentIntentId) {
		order = (await dbOrders(platform?.env.DB).getOrder(paymentIntentId));
	}
	return { paymentIntentId, order };
}
