const defaultUser = {
	name: '',
	phoneNumber: '',
	email: ''
};

const createUserStore = () => {
	let user = $state({ ...defaultUser });
	return {
		/**
		 * Update the user with new properties.
		 * @param {Partial<User>} props
		 */
		updateUser: (props) => {
			user = { ...user, ...props };
		}
	};
};

const user = createUserStore();
export default user;
