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
			amount: BigInt('100'),
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

        const amountMoney = res.payment.amountMoney ? {
            amount: res.payment.amountMoney.amount?.toString(),
            currency: res.payment.amountMoney.currency
        } : null;

		if (platform && orderId) {
            const {context, env} = platform
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
                status: 'completed',
				project_name: 'test_project_name',
				origin: 'test_origin'
			};
			context.waitUntil(dbOrders(env.DB).saveOrder(tixOrder));
		}
		return json({ id, createdAt, updatedAt, status, amountMoney, orderId, receiptUrl });
	}

	return new Response('FAILED TO CREATE SQUARE PAYMENT', { status: 500 });
}
