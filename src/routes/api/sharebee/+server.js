import dbSharebees from '$lib/db/sharebees';
import { createSharebeeHash, hashFunction } from '$lib/utils';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ platform }) {
	const db = dbSharebees(platform?.env.DB);
	// const config = await db.getSharebeeConfig();
	const config = {};

	return new Response(JSON.stringify(config), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}

const eventName = 'raptor-faight-2';

export async function POST({ cookies, request, platform }) {
	try {
		// const { id } = await request.json();
		const formData = await request.formData();
		/** @type {*} id */
		const id = formData.get('id');
		/** @type {*} qr */
		const qr = formData.get('qr');

		if (!id) {
			return new Response(JSON.stringify({ error: 'Missing sharebee ID' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const token = cookies.get('token');
		if (!token) {
			throw new Error('No authentication token provided');
		}

		const { phoneNumber } = await platform?.env.AUTH_SERVICE.authorizeToken(token);
		if (!phoneNumber) {
			throw new Error('Invalid authentication payload');
		}

		const winner = phoneNumber;

		const db = dbSharebees(platform?.env.DB);
		const success = await db.claimSharebee(id, winner);

		const r2Path = `order-qrs/${eventName}/${id}.png`;
		// await platform?.env.R2.put(r2Path, qr, {
		// 	httpMetadata: {
		// 		contentType: 'image/jpeg'
		// 	}
		// });

		await platform?.env.R2.put(r2Path, qr, {
			contentType: 'image/png'
		});

		const assetUrl = `https://r2-tix.yaytso.art/${r2Path}`;
		await platform?.env.MESSENGER_QUEUE.send({
			defaultMessage: `You got a free ticket for Raptor Faight 2! Here is your QR code`,
			phoneNumber: phoneNumber,
			mediaUrls: [assetUrl]
		});

		// save new sharebee
		const sharebeeId = createSharebeeHash(id, phoneNumber);
		await db.saveSharebee(sharebeeId, eventName);

		if (!success) {
			return new Response(JSON.stringify({ error: 'Failed to claim sharebee' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return json({ success: true, sharebeeId });

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ error: 'Invalid request' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
