import { EVENT_ID } from '$lib';
import dbSharebees from '$lib/db/sharebees';
import logger from '$lib/logging';
import { createSharebeeHash, hashFunction } from '$lib/utils';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ platform }) {
	if (!platform) {
		return new Response(JSON.stringify({ error: 'Missing platform' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	const db = dbSharebees(platform?.env.DB);
	// const config = await db.getSharebeeConfig();
	const config = {};

	return new Response(JSON.stringify(config), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function POST({ cookies, request, platform, url }) {
	try {
		// const { id } = await request.json();
		const formData = await request.formData();
		/** @type {*} id */
		const id = formData.get('id');
		/** @type {*} qr */
		const qr = formData.get('qr');

		if (!platform) {
			return new Response(JSON.stringify({ error: 'Missing platform' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

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

		// check if they already have a sharebee for the event
		const existingSharebee = await db.getSharebeeByPhoneNumberAndProjectName(winner, EVENT_ID);
		console.log(`Existing shareebee ${JSON.stringify(existingSharebee)}`);
		if (existingSharebee) {
			return new Response(JSON.stringify({ error: 'You already have a sharebee for this event' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const success = await db.claimSharebee(id, winner);

		const r2Path = `order-qrs/${EVENT_ID}/${id}.png`;
		// await platform?.env.R2.put(r2Path, qr, {
		// 	httpMetadata: {
		// 		contentType: 'image/jpeg'
		// 	}
		// });

		await platform?.env.R2.put(r2Path, qr, {
			httpMetadata: {
				contentType: 'image/png'
			}
		});

		// save new sharebee
		const sharebeeId = createSharebeeHash(id, phoneNumber);
		await db.saveSharebee(sharebeeId, EVENT_ID);

		const assetUrl = `https://r2-tix.yaytso.art/${r2Path}`;
		await platform?.env.MESSENGER_QUEUE.send({
			defaultMessage: `You got a free ticket for May 2nd! Here is your QR code. Here is your link to share with someone else: ${url.origin}/sharebee/${sharebeeId}`,
			phoneNumber: phoneNumber,
			mediaUrls: [assetUrl]
		});
		// @ts-ignore
		logger(platform?.context).info(`Sharebee claimed by ${phoneNumber}`);

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
