import { EVENT_ID } from '$lib';
import dbOrders from '$lib/db/orders';
import { createSharebeeHash } from '$lib/utils';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, platform, url }) {
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
	let followingSharebeeUrl = '';
	let followingSharebeeIsClaimed = false
	if (sharebee) {
		const r2Path = `order-qrs/${EVENT_ID}/${sharebee.id}.png`;
		sharebeeQRUrl = `https://r2-tix.yaytso.art/${r2Path}`;
		const followingSharebeeHash = createSharebeeHash(sharebee.id, phoneNumber);
		const followingSharebeeEntry = await platform?.env.DB.prepare(
			`SELECT * FROM sharebees WHERE id = ?`
		)
			.bind(followingSharebeeHash)
			.first();
		if (followingSharebeeEntry) {
			followingSharebeeUrl = `${url.origin}/sharebee/${followingSharebeeHash}`;
			followingSharebeeIsClaimed = followingSharebeeEntry.claimed_at
		}
	}

	let freebeeQRUrl = ''
	if (freebee) {
		const r2Path = `order-qrs/${EVENT_ID}/${freebee.id}.png`;
		freebeeQRUrl = `https://r2-tix.yaytso.art/${r2Path}`;
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
		sharebeeQRUrl,
		freebeeQRUrl,
		followingSharebeeUrl,
		followingSharebeeIsClaimed,
		oldOrders
	});
}
