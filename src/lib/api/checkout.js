import { checkoutActions } from '$lib';

const endpoints = {
	checkout: '/api/checkout'
};

const checkoutApi = () => {
	return {
		/** @param {Cart} cart @param {string} orderId */
		orderConfirmed: async (cart, orderId) => {
			fetch(endpoints.checkout, {
				method: 'POST',
				body: JSON.stringify({
					action: checkoutActions.ORDER_CONFIRMED,
					cart,
					orderId
				})
			});
		},
        /** @param {Cart} cart @param {string} orderId */
		orderFailed: async (cart, orderId) => {
			fetch(endpoints.checkout, {
				method: 'POST',
				body: JSON.stringify({
					action: checkoutActions.ORDER_FAILED,
					cart,
					orderId
				})
			});
		}
	};
};

export default checkoutApi();
