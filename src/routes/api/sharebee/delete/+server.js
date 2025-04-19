import dbSharebees from '$lib/db/sharebees';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request }) {
	try {
		if (!platform) {
			throw error(400, 'Missing platform');
		}
		const { id } = await request.json();

		if (!id) {
			return json({ message: 'Missing sharebee ID' }, { status: 400 });
		}

		const db = dbSharebees(platform?.env.DB);
		// Implement deleteSharebee function in dbSharebees
		await db.deleteSharebee(id);

		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Error deleting sharebee:', error);
		return json({ message: 'Failed to delete sharebee' }, { status: 500 });
	}
}