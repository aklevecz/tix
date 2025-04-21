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
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let debounceTimeout;

	/**
	 * Debounce function
	 * @template {(...args: any[]) => any} T
	 * @param {T} func The function to debounce.
	 * @param {number} wait The number of milliseconds to delay.
	 * @returns {(...args: Parameters<T>) => void} A function that delays the invocation of `func`.
	 */
	function debounce(func, wait) {
	 /**
	  * @this {ThisParameterType<T>}
	  * @param {Parameters<T>} args
	  */
	 return function(...args) {
	 	clearTimeout(debounceTimeout);
	 	// Use 'this' directly as JSDoc now defines its type
	 	debounceTimeout = setTimeout(() => func.apply(this, args), wait);
	 };
	}

	const debouncedSaveUserSession = debounce(() => {
		document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${60 * 60 * 24 * 30}`;
		userApi.updateUser(user);
	}, 500); // Debounce for 500ms

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
			debouncedSaveUserSession();
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
