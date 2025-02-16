import { dev } from '$app/environment';
import { YAYTSO_STRIPE_SECRET, YAYTSO_STRIPE_SECRET_TEST } from '$env/static/private';
import { checkoutActions } from '$lib';
import dbOrders from '$lib/db/orders';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const paymentIntentId = url.searchParams.get('paymentIntentId');
		if (!paymentIntentId) {
			return new Response(JSON.stringify({ error: 'MISSING_PAYMENT_INTENT_ID' }), { status: 400 });
		}

		const STRIPE_SECRET = dev ? YAYTSO_STRIPE_SECRET_TEST : YAYTSO_STRIPE_SECRET;

		const stripe = new Stripe(STRIPE_SECRET);
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

		return json({ paymentIntent });
	} catch (error) {
		console.error('Error in GET handler:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request }) {
	/** @type {{ action: string, cart: Cart, discount: number, metadata: any}} */
	const { action, cart, metadata } = await request.json();
	const STRIPE_SECRET = dev ? YAYTSO_STRIPE_SECRET_TEST : YAYTSO_STRIPE_SECRET;
	const stripe = new Stripe(STRIPE_SECRET);

	if (action === checkoutActions.CREATE_INTENT) {
		const abbreviatedItems = Object.keys(cart.items).map((key) => {
			return {
				id: key,
				quantity: cart.items[key].quantity
			};
		});
		const paymentIntent = await stripe.paymentIntents.create({
			// amount: calculateOrderAmount(cart || [], discount || 0),
			amount: cart.total,
			currency: 'usd',
			automatic_payment_methods: {
				enabled: true
			},
			metadata: {
				...metadata,
				store: 'tix',
				items: JSON.stringify(abbreviatedItems)
			}
		});

		if (platform) {
			const { context, env } = platform;
			const tixOrder = {
				pi_id: paymentIntent.id,
				items: JSON.stringify(cart.items),
				name: metadata.fullName,
                phone: metadata.phoneNumber,
                email: metadata.email,
                discount: cart.discount,
                subtotal: cart.subtotal,
				amount: cart.total,
				status: 'intent_created',
				project_name: 'test_project_name',
				origin: 'test_origin'
			};
			context.waitUntil(dbOrders(env.DB).saveOrder(tixOrder));
		} else {
			console.log('Platform not found');
			//LOG ERROR
		}

		return json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id
		});
	}

	if (action === checkoutActions.ORDER_CONFIRMED) {
		return json({ success: true });
	}

	if (action === checkoutActions.ORDER_FAILED) {
		return json({ success: false, message: 'ORDER_FAILED' }, { status: 500 });
	}

	return new Response('ERROR - ACTION NOT FOUND for checkout', { status: 500 });
}
