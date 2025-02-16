import { dev } from '$app/environment';
import {
	TWILIO_ACCOUNT_ID,
	TWILIO_AUTH_TOKEN,
	YAYTSO_STRIPE_SECRET,
	YAYTSO_STRIPE_SECRET_TEST,
	YAYTSO_STRIPE_WEBHOOK_SECRET,
	YAYTSO_STRIPE_WEBHOOK_SECRET_TEST
} from '$env/static/private';
import dbOrders from '$lib/db/orders';
import Stripe from 'stripe';

import { Byte, Encoder } from '@nuintun/qrcode';
import { sendMessage } from 'bao-brain';

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request }) {
	const sig = request.headers.get('stripe-signature');
	if (!sig) {
		return new Response('Missing Stripe signature', { status: 400 });
	}
	const endpointSecret = dev ? YAYTSO_STRIPE_WEBHOOK_SECRET_TEST : YAYTSO_STRIPE_WEBHOOK_SECRET;
	const STRIPE_SECRET = dev ? YAYTSO_STRIPE_SECRET_TEST : YAYTSO_STRIPE_SECRET;

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
					context.waitUntil(
						dbOrders(env.DB).updateOrder(paymentIntentId, [{ key: 'status', value: 'success' }])
					);
					let mediaUrls = [];
					try {
						const parsedItems = JSON.parse(metadata.items);
						const raptorFaight2 = parsedItems.find(
							(/** @type {{id:String, quantity: number}} */ item) => item.id === 'raptor-faight-2'
						);
						if (raptorFaight2) {
							const {quantity, id} = raptorFaight2;
							const baseUrl = `https://r2-tix.yaytso.art/orders-qrs/${id}/${paymentIntentId}`;
							for (let i = 0; i < parseInt(quantity); i++) {
								const encoder = new Encoder({
									level: 'H'
								});

								const qrcode = encoder.encode(new Byte(`${id}:${i + 1}`));

								const qrCodeUrl = qrcode.toDataURL(5, {
									// First arg: moduleSize is now 20
									margin: 4 // Optional margin
								});
								const blob = await fetch(qrCodeUrl).then((res) => res.blob());
								await platform?.env.R2.put(`orders-qrs/${id}/${paymentIntentId}/${i + 1}.png`, blob);
								mediaUrls.push(`${baseUrl}/${i + 1}.png`);
							}
						}
					} catch (error) {
						await platform?.env.tixKV.put(
							`error:create-qrs:${metadata.phoneNumber}:${paymentIntentId}`,
							JSON.stringify(error)
						);
					}
					context.waitUntil(
						sendMessage({
							env: { ...env, TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN },
							user: { id: metadata.phoneNumber, phoneNumber: metadata.phoneNumber },
							message: `Your order is complete! Thanks for your support!`,
							mediaUrls
						})
					);
				}
			}
		}
	} catch (/** @type {*} */ err) {
		console.log(err.message);
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}
	return new Response();
}
