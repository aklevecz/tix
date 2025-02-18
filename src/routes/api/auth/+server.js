// import { EVENT_ID } from '$lib/content';
// import db from '$lib/db';
import { responses } from '$lib';
import { phoneNumberToUid } from '$lib/utils';
import { json } from '@sveltejs/kit';


/** @type {import('cookie').CookieSerializeOptions & {path: string}} */
const cookieOptions = {
	path: '/',
	expires: new Date('2100-01-01'),
	secure: true, // Only sent over HTTPS
	httpOnly: true, // Not accessible via JavaScript
	sameSite: 'lax' // Protects against CSRF while allowing normal navigation
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, platform, url }) {
	// const eventName = url.searchParams.get("eventName");
	// const authorization = request.headers.get("authorization");
	// if (authorization !== SHEET_TOKEN) {
	//   return new Response(null, {
	//     status: 401,
	//     statusText: "Unauthorized",
	//   });
	// }
	// const { results: partiers } = await db.getPartiersByEvent(platform?.env.DATABASE, eventName || EVENT_ID);
	// return json(partiers);
	return json({});
}
const myNumber = '14159671642';
const testPhoneNumber = myNumber;
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, platform }) {
	const { phoneNumber, name, code } = await request.json();
	// sending code
	if (phoneNumber) {
		/** @param {string} phoneNumber */
		const success = async (phoneNumber) => {
			cookies.set('phoneNumber', phoneNumberToUid(phoneNumber), cookieOptions);
			cookies.set('name', name, cookieOptions);
			return json({ phoneNumber, message: responses.CODE_SENT });
		};
		// IF TEST PHONE NUMBER
		if (phoneNumber === testPhoneNumber) {
			return success(testPhoneNumber);
		}

		const r = await platform?.env.AUTH_SERVICE.sendCode(phoneNumber);
		if (r.status === 'pending') {
			return success(r.phoneNumber.trim());
		}
	}

	// verifying code
	if (code) {
		const storedPhoneNumber = cookies.get('phoneNumber');
		const storedName = cookies.get('name');

		if (storedPhoneNumber) {
			const approved = async () => {
				const token = await platform?.env.AUTH_SERVICE.generateToken({
					phoneNumber: storedPhoneNumber.trim()
				});
				// const token = await createJwt({ phoneNumber: storedPhoneNumber });
				try {
          // CREATE USER - but dont necessarily need to do this because the order will have it?
					// await db.createPartier(platform?.env.DATABASE, {
					// 	phoneNumber: storedPhoneNumber.trim(),
					// 	name: storedName || 'missing name'
					// });
				} catch (e) {
					console.log('user exists probably');
				}

				cookies.set('token', token, cookieOptions);
				cookies.set('authed', 'true', cookieOptions);
				return json({ message: responses.AUTHED });
			};
			// IF TEST PHONE NUMBER
			if (storedPhoneNumber === testPhoneNumber) {
				return approved();
			}
			const r = await platform?.env.AUTH_SERVICE.verifyCode({
				phoneNumber: storedPhoneNumber.trim(),
				code
			});
			if (r.status === 'approved') {
				return approved();
			}
		}
		return json({ message: responses.CODE_INVALID });
	}

	return json({ status: 400, message: responses.UNKNOWN_AUTH_ERROR });
}

export async function DELETE({ cookies }) {
	cookies.delete('phoneNumber', cookieOptions);
	cookies.delete('name', cookieOptions);
	cookies.delete('token', cookieOptions);
	cookies.delete('authed', cookieOptions);
	return json({ success: true, message: responses.LOGGED_OUT });
}
