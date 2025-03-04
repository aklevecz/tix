import { dev } from '$app/environment';
import { SQUARE_ACCESS_TOKEN_TEST } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { SquareClient, SquareEnvironment } from 'square';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const payload = await request.json();

	const square = new SquareClient({
		environment: dev ? SquareEnvironment.Sandbox : SquareEnvironment.Production,
		token: dev ? SQUARE_ACCESS_TOKEN_TEST : SQUARE_ACCESS_TOKEN_TEST
	});

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
		const { id, createdAt, updatedAt, status, amountMoney, orderId, receiptUrl } = res.payment;
		json({ id, createdAt, updatedAt, status, amountMoney, orderId, receiptUrl });
	}

	return new Response();
}
