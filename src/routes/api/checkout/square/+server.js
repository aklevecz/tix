import { dev } from '$app/environment';
import { SQUARE_ACCESS_TOKEN_TEST } from '$env/static/private';
import { isDev } from '$lib';
import dbOrders from '$lib/db/orders';
import { error, json } from '@sveltejs/kit';
import { SquareClient, SquareEnvironment } from 'square';

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request }) {
	const payload = await request.json();

	const square = new SquareClient({
		environment: isDev ? SquareEnvironment.Sandbox : SquareEnvironment.Production,
		token: isDev ? SQUARE_ACCESS_TOKEN_TEST : SQUARE_ACCESS_TOKEN_TEST
	});

	/** @type {import('square').Square.CreatePaymentRequest} */
	const payment = {
		idempotencyKey: payload.idempotencyKey,
		locationId: payload.locationId,
		sourceId: payload.sourceId,
		amountMoney: {
			// the expected amount is in cents, meaning this is $1.00.
			amount: BigInt(payload.cart.total),
			// If you are a non-US account, you must change the currency to match the country in which
			// you are accepting the payment.
			currency: 'USD'
		}
	};

	if (payload.customerId) {
		payment.customerId = payload.customerId;
	}
	if (payload.verificationToken) {
		payment.verificationToken = payload.verificationToken;
	}

	const res = await square.payments.create(payment);

	if (res.payment) {
		const { id, createdAt, updatedAt, status, orderId, receiptUrl } = res.payment;

		const amountMoney = res.payment.amountMoney
			? {
					amount: res.payment.amountMoney.amount?.toString(),
					currency: res.payment.amountMoney.currency
				}
			: null;

		// TODO: Make smarter when there can be multiple projects
		const project_name = Object.keys(payload.cart.items)[0];
		const project_object = payload.cart.items[project_name];
		const quantity = project_object.quantity;
		// TODO: Make message not hardcoded and part of project spec
		const message = `You're all set for ${quantity} ticket(s) to BAZAAR on May 2nd @ The Faight Collective! Here is your QR code, which you will also be able to see on the site and the raptor app :)`;

		if (platform && orderId) {
			const { context, env } = platform;
			const tixOrder = {
				pi_id: orderId,
				items: JSON.stringify(payload.cart.items),
				name: payload.metadata.fullName,
				phone: payload.metadata.phoneNumber,
				email: payload.metadata.email,
				discount: payload.cart.discount,
				subtotal: payload.cart.subtotal,
				amount: payload.cart.total,
				// status: 'intent_created',
				status: status || 'unknown',
				project_name: project_name || 'no_project',
				origin: 'tix'
			};
			context.waitUntil(dbOrders(env.DB).saveOrder(tixOrder));
			context.waitUntil(
				env.MESSENGER_QUEUE.send({
					defaultMessage: message,
					phoneNumber: payload.metadata.phoneNumber
				})
			);
		}
		return json({ id, createdAt, updatedAt, status, amountMoney, orderId, receiptUrl });
	}

	return new Response('FAILED TO CREATE SQUARE PAYMENT', { status: 500 });
}
