const endpoints = {
	cart: 'api/cart'
};

const cartApi = () => {
	return {
		getCart: async () => {
			try {
				const response = await fetch(`/${endpoints.cart}`);
				return await response.json();
			} catch (e) {
				console.error(`api/cart.js: ERROR WHILE FETCHING ${endpoints.cart} FROM getCart`);
				console.error(e);
			}
		},
		/** @param {Cart} cart */
		updateCart: async (cart) => {
			try {
				const response = await fetch(`/${endpoints.cart}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({cart})
				});
				return await response.json();
			} catch (e) {
				console.error(`api/cart.js: ERROR WHILE UPDATING ${endpoints.cart} from updateCart`);
				console.error(e);
			}
		}
	};
};

export default cartApi()