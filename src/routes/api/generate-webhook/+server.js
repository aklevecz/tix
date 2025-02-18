import { EVENT_ID } from '$lib';

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request }) {
	/** @type {ReplicateResponse} body */
	const data = await request.json();
	if (!data) {
		return new Response('No data provided', { status: 400 });
	}

	const phoneNumber = await platform?.env.tixKV.get(`generations:${data.id}`);
	const imgUrl = data.output[0];
	await platform?.env.tixKV.delete(`generations:${data.id}`);

	try {
		// Fetch the image from the URL
		const response = await fetch(imgUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.statusText}`);
		}

		// const imageBlob = await response.blob();
		const imgBuffer = await response.arrayBuffer();
		const imageBlob = new Blob([imgBuffer], { type: 'image/jpeg' });
		const contentType = imageBlob.type.toLowerCase();
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

		if (!allowedTypes.includes(contentType)) {
			throw new Error(
				`Invalid image type: ${contentType}. Allowed types: ${allowedTypes.join(', ')}`
			);
		}

		// Generate filename with timestamp to prevent overwrites
		const timestamp = Date.now();
		const filepath = `${EVENT_ID}/${phoneNumber}`;
		const contentTypeSuffix = contentType.split('/')[1];
		const filename = `raptor.${contentTypeSuffix}`;
		const key = `${filepath}/${filename}`;

		// Upload to R2 with explicit content type
		await platform?.env.R2.put(key, imageBlob, {
			httpMetadata: {
				contentType,
				cacheControl: 'public, max-age=31536000'
			},
			customMetadata: {
				uploadedAt: new Date().toISOString(),
				type: 'generated'
			}
		});

		console.log(`Successfully uploaded image: ${filename}`);
	} catch (error) {
		console.error('Error saving image to R2:', error);
		return new Response('Error saving image', { status: 500 });
	}

	return new Response('ok');
}
