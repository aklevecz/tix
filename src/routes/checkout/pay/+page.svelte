<script>
	import { dev } from '$app/environment';
	import {
		PUBLIC_YAYTSO_STRIPE_CLIENT_ID,
		PUBLIC_YAYTSO_STRIPE_CLIENT_ID_TEST
	} from '$env/static/public';
	import { checkoutActions } from '$lib';
	import checkoutApi from '$lib/api/checkout';
	import Slider from '$lib/compontents/checkout/slider.svelte';
	import cart from '$lib/stores/cart.svelte';
	import user from '$lib/stores/user.svelte';
	import { appearance, options } from '$lib/stripe';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	const clientId = dev ? PUBLIC_YAYTSO_STRIPE_CLIENT_ID_TEST : PUBLIC_YAYTSO_STRIPE_CLIENT_ID;
	/** @type {any} */
	let stripe = $state(null);
	/** @type {any} */
	let elements = $state(null);

	let orderId = $state('');

	let paymentElementLoaded = $state(false);

	async function createPaymentIntent() {
		if (!cart.state.id) {
			return;
		}
		console.log('CREATING PAYMENT INTENT');

		const response = await fetch(`/api/checkout`, {
			method: 'POST',
			body: JSON.stringify({
				action: checkoutActions.CREATE_INTENT,
				cart: cart.state,
				metadata: {
					fullName: user.state.fullName,
					email: user.state.email,
					phoneNumber: user.state.phoneNumber,
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
		const { clientSecret, error, paymentIntentId } = await response.json();
		// @ts-ignore
		stripe = Stripe(clientId);
		if (!stripe) {
			return;
		}
		elements = stripe.elements({ clientSecret, appearance });
		const paymentElement = elements.create('payment', options);
		paymentElement.mount('#payment-element');
		paymentElement.on('ready', () => {
			paymentElementLoaded = true;
			console.log('Payment Element is fully loaded.');
		});
		// paymentElement.on('change', (event) => {
		// 	paymentIsValid = event.complete;
		// });
	}

	$effect(() => {
		createPaymentIntent();
	});

	let fetching = $state(false);

	async function onPay() {
		fetching = true;
		if (!elements || !stripe) {
			return;
		}
		// Could check inventory one more time here
		const host = window.location.host;
		const protocol = window.location.protocol;
		// shouldn't throw the order completion and is loggd on the backend if it fails
		// TODO: HANDLE ERRORS
		await checkoutApi.orderConfirmed(cart.state, orderId);
		const { error } = await stripe.confirmPayment({
			elements: elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: `${protocol}//${host}/receipt`
				// receipt?date=${$appState.date}&event=${eventName}`,
			}
		});
		if (error) {
			// TODO: HANDLE ERRORS
			await checkoutApi.orderFailed(cart.state, orderId);
			alert(
				`Hm an error has occurred while finalizing your payment, try again, or contact ariel@yaytso.art, here is the probably confusingly technical error message: ${JSON.stringify(error)}`
			);
			// Send an error to the backend to be logged
		} else {
			// shop.clearCart();
			// checkingOutState = 'idle';
		}

		fetching = false;
	}
</script>

<div class="card-base m-4">
	<div class="bg-[#1a1a1a] p-4 px-6 text-lg text-gray-300">
		<div>{user.state.fullName}</div>
		<div>{user.state.email}</div>
		<div>{user.state.phoneNumber}</div>
		<a class="text-sm text-blue-300 capitalize underline" href="/checkout">Edit</a>
	</div>
</div>
<div class="payment-container">
	<div id="payment-element" class="payment-element">
		<div class="loading-animation">
			<div class="spinner"></div>
			<div class="loading-text">Loading</div>
		</div>
	</div>
	<button
		onclick={onPay}
		disabled={!paymentElementLoaded}
		class="btn-bauhaus m-auto mt-4 block w-9/12">Pay</button
	>
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";

	/* Container for the entire payment section */
	.payment-container {
		@apply mt-4 max-w-lg rounded-md;
	}

	/* Totals section styling */
	.totals {
		@apply mb-4;
	}

	.totals h2 {
		@apply mb-2;
	}

	.subtotal {
		@apply text-lg font-bold tracking-wide text-white uppercase;
	}

	.total {
		@apply text-xl font-extrabold tracking-wide text-[var(--red)] uppercase;
	}

	/* Payment element area styling */
	.payment-element {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		@apply mb-4;
	}

	.loading-animation {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	/* Spinner design */
	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid transparent;
		border-top-color: #de0000;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	/* Loading text styling */
	.loading-text {
		color: #ffffff;
		font-size: 1.2rem;
		text-transform: uppercase;
		letter-spacing: 0.1rem;
	}

	/* Keyframes for the spinner animation */
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
