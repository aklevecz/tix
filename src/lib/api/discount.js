const endpoints = {
	discount: 'api/discount'
};

const discountApi = () => {
	return {
		/** @param {string} discountCode */
		applyDiscount: async (discountCode) => {
			try {
				const response = await fetch(`/${endpoints.discount}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ discountCode })
				});
				return await response.json();
			} catch (e) {
				console.error(
					`api/discount.js: ERROR WHILE UPDATING ${endpoints.discount} from applyDiscount`
				);
				console.error(e);
			}
		}
	};
};

export default discountApi();
