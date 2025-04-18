import { checkoutActions } from '$lib';
import { phoneNumberToUid } from '$lib/utils';

const endpoints = {
	checkout: '/api/checkout',
	checkoutSquare: '/api/checkout/square'
};

const checkoutApi = () => {
	return {
		/** @param {{cart:Cart, user:User, locationId:string, token:string}} props */
		createPaymentSquare: async ({ cart, user, locationId, token }) => {
			const body = JSON.stringify({
				locationId,
				sourceId: token,
				idempotencyKey: window.crypto.randomUUID(),
				cart,
				metadata: {
					fullName: user.fullName,
					email: user.email,
					phoneNumber: phoneNumberToUid(`${user.phoneNumber.countryCode}${user.phoneNumber.number}`)
				}
			});
			const paymentResponse = await fetch(endpoints.checkoutSquare, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body
			});
			return paymentResponse;
		},
		/** @param {{cart:*, user:*}} props */
		createPaymentIntent: async ({ cart, user }) => {
			const response = await fetch(`/api/checkout`, {
				method: 'POST',
				body: JSON.stringify({
					action: checkoutActions.CREATE_INTENT,
					cart: cart.state,
					metadata: {
						fullName: user.state.fullName,
						email: user.state.email,
						phoneNumber: phoneNumberToUid(
							`${user.state.phoneNumber.countryCode}${user.state.phoneNumber.number}`
						),
						// street1: shop.state.userInfo.address.street1,
						// street2: shop.state.userInfo.address.street2,
						// city: shop.state.userInfo.address.city,
						// state: shop.state.userInfo.address.state,
						// postalCode: shop.state.userInfo.address.postalCode,
						// country: shop.state.userInfo.address.country,
						subtotal: cart.state.subtotal,
						code: ''
					}
				})
			});
			if (response.ok) {
				const { clientSecret, error, paymentIntentId } = await response.json();

				return { clientSecret, error, paymentIntentId };
			} else {
				const text = await response.text();
				throw new Error(text);
			}
		},
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
