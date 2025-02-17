import userApi from '$lib/api/user';
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

	function saveUserSession() {
		document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${60 * 60 * 24 * 30}`;
		userApi.updateUser(user);
	}

	return {
		get state() {
			return user;
		},
		/**
		 * Update the user with new properties.
		 * @param {Partial<User>} props
		 */
		updateUser: (props) => {
			user = { ...user, ...props };
            saveUserSession()
		}
	};
};

const user = createUserStore();
export default user;
