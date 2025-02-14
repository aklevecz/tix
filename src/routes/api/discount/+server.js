import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { discountCode } = await request.json();
	// SIGN A COOKIE WITH THE DISCOUNT
	return json({ discountCode, discount: 25 });
}
