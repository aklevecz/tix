import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { discountCode } = await request.json();
	if (discountCode === '1') {
		return json({ discountCode, discount: 25 });
	}

	return json({ discountCode, discount: 0 });
}
