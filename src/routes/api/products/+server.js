import { mockProducts } from '$lib';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return json(mockProducts);
}
