const endpoints = {
	user: 'api/user'
};

const userApi = () => {
	return {
		getUser: async () => {
			try {
				const response = await fetch(`/${endpoints.user}`);
				return await response.json();
			} catch (e) {
				console.error(`api/user.js: ERROR WHILE FETCHING ${endpoints.user} FROM getuser`);
				console.error(e);
			}
		},
		/** @param {User} user */
		updateUser: async (user) => {
			try {
				const response = await fetch(`/${endpoints.user}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({user})
				});
				return await response.json();
			} catch (e) {
				console.error(`api/user.js: ERROR WHILE UPDATING ${endpoints.user} from updateuser`);
				console.error(e);
			}
		}
	};
};

export default userApi()