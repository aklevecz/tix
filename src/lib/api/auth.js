import { responses } from "$lib";

const endpoints = {
	auth: 'api/auth'
};

const authApi = () => {
	return {
		/** @param {string} phoneNumber */
		sendCode: async (phoneNumber) => {
			try {
				const response = await fetch(`/${endpoints.auth}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ phoneNumber })
				});
				return await response.json();
			} catch (e) {
				console.error(`api/auth.js: ERROR WHILE FETCHING ${endpoints.auth} FROM login`);
				console.error(e);
				return {message: responses.UNKNOWN_AUTH_ERROR}
			}
		},
		/** @param {string} code */
		verifyCode: async (code) => {
			try {
				const response = await fetch(`/${endpoints.auth}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ code })
				});
				return await response.json();
			} catch (e) {
				console.error(`api/auth.js: ERROR WHILE FETCHING ${endpoints.auth} FROM login`);
				console.error(e);
				return {message: responses.UNKNOWN_AUTH_ERROR}
			}
		},
		logout: async () => {
			try {
				const response = await fetch(`/${endpoints.auth}`, { method: 'DELETE' });
				return await response.json();
			} catch (e) {
				console.error(`api/auth.js: ERROR WHILE UPDATING ${endpoints.auth} from DELETE`);
				console.error(e);
			}
		}
	};
};

export default authApi();
