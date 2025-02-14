import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return json({});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
	const { user } = await request.json();
    // CHECK user SIGNATURE
	try {
		cookies.set('user', JSON.stringify(user), { path: '/', httpOnly: false, maxAge: 60 * 60 * 24 * 30 });
	} catch (e) {
		console.error(e);
		return new Response('ERROR', { status: 500 });
	}
	return json({ success: true });
}
