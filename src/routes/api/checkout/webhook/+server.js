import {
	YAYTSO_STRIPE_SECRET,
	YAYTSO_STRIPE_SECRET_TEST,
	YAYTSO_STRIPE_WEBHOOK_SECRET,
	YAYTSO_STRIPE_WEBHOOK_SECRET_TEST
} from '$env/static/private';
import dbOrders from '$lib/db/orders';
import Stripe from 'stripe';

import { isDev } from '$lib';
import { Byte, Encoder } from '@nuintun/qrcode';

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request }) {
	const sig = request.headers.get('stripe-signature');
	if (!sig) {
		return new Response('Missing Stripe signature', { status: 400 });
	}
	let endpointSecret = isDev ? YAYTSO_STRIPE_WEBHOOK_SECRET_TEST : YAYTSO_STRIPE_WEBHOOK_SECRET;
	const STRIPE_SECRET = isDev ? YAYTSO_STRIPE_SECRET_TEST : YAYTSO_STRIPE_SECRET;

	// OVERRIDE FOR LOCAL TESTING
	// if (isDev) {
	// 	endpointSecret = 'whsec_adabf5f7d531a1f4f9a7465ddd2d4f5ab10168dc33685d82b46821f1493f6991'
	// }

	const stripe = new Stripe(STRIPE_SECRET);
	const rawBody = await request.text();
	try {
		let event = await stripe.webhooks.constructEventAsync(rawBody, sig, endpointSecret);

		if (event.type === 'charge.succeeded') {
			if (platform) {
				const { context, env } = platform;
				/** @type {*} */
				// const paymentIntentId = event.data.object.payment_intent;
				// console.log(event.data.object.billing_details)
				// console.log(event.data.object.metadata)
				const { metadata, payment_intent: paymentIntentId } = event.data.object;
				if (metadata.store !== 'tix') {
					return new Response('wrong store', { status: 200 });
				}
				if (paymentIntentId) {
					const order = await dbOrders(env.DB).getOrder(paymentIntentId);
					if (!order) {
						return new Response('Order does not exist', { status: 404 });
					}
					context.waitUntil(
						dbOrders(env.DB).updateOrder(paymentIntentId, [{ key: 'status', value: 'success' }])
					);
					let mediaUrls = [];
					// TODO: DONT BE RAPTOR-FAIGHT-2 SPECIFIC
					// const CURRENT_EVENT = 'raptor-faight-2	';
					const project_name = order.project_name;
					try {
						const parsedItems = JSON.parse(metadata.items);
						const metadataObject = parsedItems.find(
							(/** @type {{id:String, quantity: number}} */ item) => item.id === project_name
						);
						if (metadataObject) {
							const {quantity} = metadataObject;
							const baseUrl = `https://r2-tix.yaytso.art/orders-qrs/${project_name}/${paymentIntentId}`;
							for (let i = 0; i < parseInt(quantity); i++) {
								const encoder = new Encoder({
									level: 'H'
								});

								const qrcode = encoder.encode(new Byte(`${paymentIntentId}:${i + 1}`));

								const qrCodeUrl = qrcode.toDataURL(5, {
									// First arg: moduleSize is now 20
									margin: 4 // Optional margin
								});
								const blob = await fetch(qrCodeUrl).then((res) => res.blob());
								await platform?.env.R2.put(`orders-qrs/${project_name}/${paymentIntentId}/${i + 1}.png`, blob);
								mediaUrls.push(`${baseUrl}/${i + 1}.png`);
							}
							context.waitUntil(
								env.MESSENGER_QUEUE.send({
								  defaultMessage: `You're all set with ${quantity} ticket(s) to Bazaar on May 2nd @ The Faight Collective!`,
								  phoneNumber: metadata.phoneNumber,
								  mediaUrls
								})
							  );
						}
					} catch (error) {
						await env.tixKV.put(
							`error:create-qrs:${metadata.phoneNumber}:${paymentIntentId}`,
							JSON.stringify(error)
						);
					}

				}
			}
		}
	} catch (/** @type {*} */ err) {
		console.log(err.message);
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}
	return new Response();
}
