// SEPARATE SETTING STAR AND FAVORITE FROM UPLOADING - OR JUST HAVE AN ACTION TYPE BETWEEN FAVORITE AND STAR

import { EVENT_ID } from '$lib';

// OR JUST MOVE UPLOADING INTO AN ABSTRACTED FUNCTION AND HAVE ENDPOINTS FOR FAVORITE VS FAVORTIES

export async function GET({ platform, cookies, url }) {
	try {
		let generationType = url.searchParams.get('generationType') || 'raptor';
		let userId = url.searchParams.get('id');

		// Validate platform and storage
		if (!platform?.env.R2) {
			throw new Error('Storage not configured');
		}

		if (!userId) {
			// Authorize user
			const token = cookies.get('token');
			if (!token) {
				throw new Error('No authentication token provided');
			}

			const { phoneNumber } = await platform.env.AUTH_SERVICE.authorizeToken(token);
			if (!phoneNumber) {
				throw new Error('Invalid authentication payload');
			}
      userId = phoneNumber;
		}

		const key = `${EVENT_ID}/${userId}/${generationType}.jpeg`;
		const object = await platform.env.R2.get(key);
		if (!object) {
			return new Response('Image not found', { status: 404 });
		}

		// Return R2 object with its headers
		return new Response(object.body, {
			headers: {
				'content-type': object.httpMetadata.contentType || 'image/jpeg',
				'cache-control': 'public, max-age=31536000',
				etag: object.httpEtag
			}
		});
	} catch (e) {
		console.error(e);
	}
	return new Response(null, { status: 404 });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, platform, cookies }) {
	try {
		const formData = await request.formData();
		// Validate platform and storage
		if (!platform?.env.R2) {
			throw new Error('Storage not configured');
		}

		// REMOVING AUTH REQUIREMENT FOR GENERATION AT THE MOMENT
		let phoneNumber = formData.get('phoneNumber');
		if (!phoneNumber) {
			// Authorize user
			const token = cookies.get('token');
			if (!token) {
				throw new Error('No authentication token provided');
			}

			const decoded = await platform.env.AUTH_SERVICE.authorizeToken(token);
			phoneNumber = decoded.phoneNumber;
			if (!phoneNumber) {
				throw new Error('Invalid authentication payload');
			}
		}
		// Parse form data
		const id = formData.get('id');
		const imageFile = formData.get('image');
		const prompt = formData.get('prompt')?.toString().trim();

		// Validate image
		if (!imageFile || !(imageFile instanceof Blob)) {
			throw new Error('No image provided');
		}

		// Validate image type
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
		const contentType = imageFile.type.toLowerCase();

		if (!allowedTypes.includes(contentType)) {
			throw new Error(
				`Invalid image type: ${contentType}. Allowed types: ${allowedTypes.join(', ')}`
			);
		}

		// Validate image size (e.g., max 5MB)
		const maxSize = 50 * 1024 * 1024; // 5MB
		if (imageFile.size > maxSize) {
			throw new Error(`Image too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
		}

		// Generate filename with timestamp to prevent overwrites
		const timestamp = Date.now();
		const filepath = `${EVENT_ID}/${phoneNumber}`;
		const contentTypeSuffix = contentType.split('/')[1];

		const filename = `${id}.${contentTypeSuffix}`;

		const key = `${filepath}/${filename}`;
		// Upload to R2 with explicit content type
		await Promise.all([
			platform.env.R2.put(key, imageFile, {
				httpMetadata: {
					contentType,
					cacheControl: 'public, max-age=31536000'
				},
				customMetadata: {
					prompt: prompt || '',
					uploadedAt: new Date().toISOString(),
					type: 'full'
				}
			})
			// platform.env.STORAGE.put(`${filename}_thumb.png`, thumbnailFile, {
			// 	httpMetadata: {
			// 		contentType: 'image/png',
			// 		cacheControl: 'public, max-age=31536000'
			// 	},
			// 	customMetadata: {
			// 		prompt: prompt || '',
			// 		uploadedAt: new Date().toISOString(),
			// 		type: 'thumbnail'
			// 	}
			// })
		]);
		console.log(`Successfully uploaded image: ${filename}`);

		// DIFFERENT ACTIONS FOR FAVORITES OR MAIN
		// if (action === 'save-main') {
		// 	const thumbnailKey = `${phoneNumber}:favorite:b3:base64`;
		// 	await platform?.env.BAO_GEN.put(thumbnailKey, thumbnailBase64);
		//     await platform?.env.BAO_GEN.put(`${phoneNumber}:favorite:b3`, id);
		// }
		// // Log successful upload
		// if (action === 'save-favorites') {
		// 	const favoritesKey = `${phoneNumber}:favorites:b3`;
		// 	const currentFavoritesRes = await platform?.env.BAO_GEN.get(favoritesKey);
		// 	let currentFavorites = new Set();
		// 	if (currentFavoritesRes) {
		// 		currentFavorites = new Set(JSON.parse(currentFavoritesRes));
		// 	}
		// 	currentFavorites.add(id);
		// 	await platform?.env.BAO_GEN.put(favoritesKey, JSON.stringify(Array.from(currentFavorites)));
		// }
		// Return success response
		return new Response(
			JSON.stringify({
				success: true,
				filename,
				imageUrl: `/img?id=${phoneNumber}.${contentTypeSuffix}`, // URL for your GET endpoint
				timestamp,
				contentType,
				size: imageFile.size
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (/** @type {*} error */ error) {
		// Log error with details
		console.error('Upload error:', {
			message: error.message,
			stack: error.stack,
			timestamp: new Date().toISOString()
		});

		// Return error response
		return new Response(
			JSON.stringify({
				success: false,
				error: error.message || 'Upload failed',
				timestamp: Date.now()
			}),
			{
				status: error.message.includes('Storage not configured')
					? 500
					: error.message.includes('authentication')
						? 401
						: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
}
