import { EVENT_ID } from '$lib';
import dbOrders from '$lib/db/orders';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, platform }) {
	const token = cookies.get('token');
	if (!token) {
		return new Response(null, { status: 401 });
	}

	const { phoneNumber } = await platform?.env.AUTH_SERVICE.authorizeToken(token);
	if (!phoneNumber) {
		return new Response(null, { status: 401 });
	}

	const orders = await dbOrders(platform?.env.DB).getOrdersByPhoneNumber(phoneNumber);
	const freebee = await platform?.env.DB.prepare(`SELECT * FROM freebees WHERE winner = ?`)
		.bind(phoneNumber)
		.first();

	const sharebee = await platform?.env.DB.prepare(`SELECT * FROM sharebees WHERE winner = ?`)
		.bind(phoneNumber)
		.first();

	let sharebeeQRUrl = '';
	if (sharebee) {
		const r2Path = `order-qrs/${EVENT_ID}/${sharebee.id}.png`;
		sharebeeQRUrl = `https://r2-tix.yaytso.art/${r2Path}`;
	}

	const { results: oldOrders } = await platform?.env.DB.prepare(
		`SELECT * FROM orders where phone_number = ?`
	)
		.bind(phoneNumber)
		.all();
	return json({ phoneNumber, orders, freebee, sharebee, sharebeeQRUrl, oldOrders });
}
