import { dev } from '$app/environment';
import {
	YAYTSO_STRIPE_SECRET,
	YAYTSO_STRIPE_SECRET_TEST,
	YAYTSO_STRIPE_WEBHOOK_SECRET
} from '$env/static/private';
import Stripe from 'stripe';

const webhookSigningSecret =
	'whsec_adabf5f7d531a1f4f9a7465ddd2d4f5ab10168dc33685d82b46821f1493f6991';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const sig = request.headers.get('stripe-signature');
	if (!sig) {
		return new Response('Missing Stripe signature', { status: 400 });
	}
	const endpointSecret = dev ? webhookSigningSecret : YAYTSO_STRIPE_WEBHOOK_SECRET;
	const STRIPE_SECRET = dev ? YAYTSO_STRIPE_SECRET_TEST : YAYTSO_STRIPE_SECRET;

	const stripe = new Stripe(STRIPE_SECRET);
	const rawBody = await request.text();
	try {
		let event = await stripe.webhooks.constructEventAsync(rawBody, sig, endpointSecret);
        console.log(event.type)
	} catch (/** @type {*} */ err) {
		console.log(err.message);
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}
	return new Response();
}
