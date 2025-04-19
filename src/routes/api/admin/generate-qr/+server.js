import { generateQR } from '$lib/qr';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request }) {
	try {
		const { pid, project_name, quantity } = await request.json();
		for (let i = 0; i < quantity; i++) {
			const { blob } = await generateQR(`${pid}:${i}`);
			console.log(blob);
			await platform?.env.R2.put(`orders-qrs/${project_name}/${pid}/${i + 1}.png`, blob);
		}
		return json({ success: true });
	} catch (error) {
		console.error(error);
		throw error;
	}
}
