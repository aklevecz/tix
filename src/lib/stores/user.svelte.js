import userApi from '$lib/api/user';
import authApi from '$lib/api/auth';

const defaultUser = {
	fullName: '',
	phoneNumber: {
		countryCode: '',
		number: ''
	},
	email: ''
};

const createUserStore = () => {
	let user = $state({ ...defaultUser });
	let token = $state('');

	function saveUserSession() {
		document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${60 * 60 * 24 * 30}`;
		userApi.updateUser(user);
	}

	return {
		get state() {
			return user;
		},
		get token() {
			return token;
		},
		get cleanPhoneNumber() {
			return `${user.phoneNumber.countryCode.replace('+', '')}${user.phoneNumber.number}`
		},
		/**
		 * Update the user with new properties.
		 * @param {Partial<User>} props
		 */
		updateUser: (props) => {
			user = { ...user, ...props };
            saveUserSession()
		},
		/** @param {string} phoneNumber */
		sendCode: async (phoneNumber) => {
			const r = await authApi.sendCode(phoneNumber);
			return r
		},
		/** @param {string} code */
		verifyCode: async (code) => {
			const r = await authApi.verifyCode(code);
			return r
		},
		/** @param {string} newToken */
		updateToken: (newToken) => {
			token = newToken;
		},
		logout: async () => {
			await authApi.logout();
			token = '';
		}
	};
};

const user = createUserStore();
export default user;
