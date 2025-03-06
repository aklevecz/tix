import { REPLICATE_API_TOKEN } from '$env/static/private';
import configurations from '$lib/configurations';
// import configuration from "$lib/configuration";
import { json } from '@sveltejs/kit';

const headers = {
	Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
	'Content-Type': 'application/json'
	//   'Prefer': 'wait'
};

const webhook = 'https://tix-487.pages.dev/api/generate-webhook';

/**
 * @param {string} prompt - The prompt for the prediction
 * @param {import("$lib/configurations").Configuration} configuration - The configuration for the prediction
 * @returns {Promise<ReplicateResponse | undefined>} - The prediction result
 */
const makeReplicateRequestPublic = async (prompt, configuration) => {
	const url = 'https://api.replicate.com/v1/predictions';
	const headers = {
		Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
		'Content-Type': 'application/json'
	};
	const body = JSON.stringify({
		version: configuration.replicateId,
		input: {
			prompt,
			...configuration.modelParams,
			disable_safety_checker: true
			// hf_lora: configuration.model
		},
		webhook
	});
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: body
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
	}
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, platform, request }) {
	let { prompt, model = 'aklevecz/bao-flux-schnell', phoneNumber } = await request.json();
	// GET NUMBER FROM TOKEN?
	// const token = cookies.get('token');
	// if (!token) {
	// 	throw new Error('No authentication token provided');
	// }

	// const { phoneNumber } = await platform?.env.AUTH_SERVICE.authorizeToken(token);
	// if (!phoneNumber) {
	// 	throw new Error('Invalid authentication payload');
	// }
	console.log(`phoneNumber: ${phoneNumber}`);
	const configuration = configurations[model];
	const data = await makeReplicateRequestPublic(prompt, configuration);

	if (data) {
		await platform?.env.tixKV.put(`generations:${data.id}`, phoneNumber, {
			expirationTtl: 60 * 60 * 24
		});
	}
	return json(data);
}

export async function GET({ url }) {
	const id = url.searchParams.get('id');
	console.log(`Polling id ${id}`);
	const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, { headers });
	const data = await res.json();
	console.log(data);
	return json(data);
}
