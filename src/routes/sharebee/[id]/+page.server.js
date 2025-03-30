import dbSharebees from '$lib/db/sharebees';
import { createSharebeeHash, hashFunction } from '$lib/utils';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params, platform }) {
	const { id } = params;
	const sharebee = await dbSharebees(platform?.env.DB).getSharebee(id);
	if (!sharebee) {
		error(404, `Sharebee with ID ${id} not found`); // This will trigger a 404 error page
	}

	const token = cookies.get('token');
	if (!token) {
		return {
			id,
			isWinner: false,
			isShareer: false,
			followingSharebeeUrl: null,
			followingSharebeeId: null,
			project_name: sharebee.project_name,
			created_at: sharebee.created_at,
			claimed_at: sharebee.claimed_at
		};
	}
	const { phoneNumber } = await platform?.env.AUTH_SERVICE.authorizeToken(token);
	const { winner, project_name, created_at, claimed_at } = sharebee;

	let isWinner = false;
	let followingSharebeeId;
	let followingSharebeeUrl;
	if (phoneNumber && winner) {
		isWinner = phoneNumber === winner;
		if (isWinner) {
			const baseUrl = `http://localhost:5173`;
			const determinedSharebeeId = createSharebeeHash(id, phoneNumber);
			followingSharebeeId = determinedSharebeeId;
			followingSharebeeUrl = `${baseUrl}/sharebee/${determinedSharebeeId}`;
		}
	}

	let isShareer = false;
	const shareHash = id.split('-')[0];
	if (shareHash === hashFunction(phoneNumber)) {
		isShareer = true;
	}
	console.log('isShareer', isShareer);

	return {
		id,
		isWinner,
		isShareer,
		followingSharebeeUrl,
		followingSharebeeId,
		project_name,
		created_at,
		claimed_at
	};
}
