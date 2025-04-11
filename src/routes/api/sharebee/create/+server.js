import dbSharebees from '$lib/db/sharebees';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request }) {
	try {
		const { sharebeeId, projectName } = await request.json();

		if (!sharebeeId || !projectName) {
			return json({ message: 'Missing sharebee ID or project name' }, { status: 400 });
		}

		const db = dbSharebees(platform?.env.DB);
		await db.saveSharebee(sharebeeId, projectName);

		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Error creating sharebee:', error);
		return json({ message: 'Failed to create sharebee' }, { status: 500 });
	}
}