import { EVENT_ID } from '$lib';
import dbOrders from '$lib/db/orders';
import { createSharebeeHash } from '$lib/utils';
import { error, json } from '@sveltejs/kit';

// MAYBE USE THIS LATER
/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, platform, url }) {
	const token = cookies.get('token');
	if (!token) {
		return new Response(null, { status: 401 });
	}

	if (!platform) {
		throw error(400, 'Missing platform');
	}

	const { phoneNumber } = await platform?.env.AUTH_SERVICE.authorizeToken(token);
	if (!phoneNumber) {
		return new Response(null, { status: 401 });
	}

	const orders = await dbOrders(platform?.env.DB).getOrdersByPhoneNumber(phoneNumber);

	const freebee = await platform?.env.DB.prepare(`SELECT * FROM freebees WHERE winner = ?`)
		.bind(phoneNumber)
		.first();

	/** @type {SharebeeEntry | null} */
	const sharebee = await platform?.env.DB.prepare(`SELECT * FROM sharebees WHERE winner = ?`)
		.bind(phoneNumber)
		.first();

	/** @type {(paymentIntentId:string, ticketN:number) => string} */
	const genOrderUrl = (paymentIntentId, ticketN) =>
		`/api/img?path=${encodeURIComponent(`orders-qrs/${EVENT_ID}/${paymentIntentId}/${ticketN}.png`)}`;
	//  const orderUrl = (paymentIntentId) => `https://r2-tix.yaytso.art/orders-qrs/${EVENT_ID}/${paymentIntentId}`;

	/** @type {string[]} */
	let ordersUrls = [];
	if (orders.length) {
		// ordersUrls = orders.map((order) => {
		// 	// Use the genOrderUrl and group them by paymentId and their quantity
		// 	// so a paymentId has a quantity of 2, then there should be two urls each with the paymentId and a ticketN of 1 and 2
		// 	// IMPLEMENT HERE
		// });

		ordersUrls = orders.flatMap((order) => {
			// Parse the items to get the quantity
			let item = JSON.parse(order.items)[EVENT_ID];
			if (!item) {
				item = JSON.parse(order.items)['r4pt0rz'];
			}
			const quantity = item.quantity;
			// Create an array of ticket numbers based on the quantity
			// If multiple items exist, we'll handle the total quantity across all items
			// const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

			// Generate URLs for each ticket number
			return Array.from({ length: quantity }, (_, index) => {
				const ticketN = index + 1; // Ticket numbers start from 1
				return genOrderUrl(order.pi_id, ticketN);
			});
		});
	}
	console.log(ordersUrls);

	let sharebeeQRUrl = '';
	let followingSharebeeUrl = '';
	let followingSharebeeIsClaimed = false;
	if (sharebee) {
		const r2Path = `order-qrs/${EVENT_ID}/${sharebee.id}.png`;
		// sharebeeQRUrl = `https://r2-tix.yaytso.art/${r2Path}`;
		sharebeeQRUrl = `/api/img?path=${encodeURIComponent(r2Path)}`;

		const followingSharebeeHash = createSharebeeHash(sharebee.id, phoneNumber);
		const followingSharebeeEntry = await platform?.env.DB.prepare(
			`SELECT * FROM sharebees WHERE id = ?`
		)
			.bind(followingSharebeeHash)
			.first();
		if (followingSharebeeEntry) {
			followingSharebeeUrl = `${url.origin}/sharebee/${followingSharebeeHash}`;
			followingSharebeeIsClaimed = Boolean(followingSharebeeEntry.claimed_at);
		}
	}

	let freebeeQRUrl = '';
	if (freebee) {
		const r2Path = `order-qrs/${EVENT_ID}/${freebee.id}.png`;
		// freebeeQRUrl = `https://r2-tix.yaytso.art/${r2Path}`;
		freebeeQRUrl = `/api/img?path=${encodeURIComponent(r2Path)}`;
	}

	const { results: oldOrders } = await platform?.env.DB.prepare(
		`SELECT * FROM orders where phone_number = ?`
	)
		.bind(phoneNumber)
		.all();

	return json({
		phoneNumber,
		orders,
		freebee,
		sharebee,
		ordersUrls,
		sharebeeQRUrl,
		freebeeQRUrl,
		followingSharebeeUrl,
		followingSharebeeIsClaimed,
		oldOrders
	});
}
