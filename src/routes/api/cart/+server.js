import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return json({});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
	const { cart } = await request.json();
    // CHECK CART SIGNATURE
	try {
		cookies.set('cart', JSON.stringify(cart), { path: '/', httpOnly: false, maxAge: 60 * 60 * 24 * 30 });
	} catch (e) {
		console.error(e);
		return new Response('ERROR', { status: 500 });
	}
	return json({ success: true });
}
