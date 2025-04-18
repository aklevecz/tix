<script>
	import { browser } from '$app/environment';
	import {
		PUBLIC_YAYTSO_STRIPE_CLIENT_ID,
		PUBLIC_YAYTSO_STRIPE_CLIENT_ID_TEST
	} from '$env/static/public';
	import { isDev } from '$lib';
	import checkoutApi from '$lib/api/checkout';
	import cart from '$lib/stores/cart.svelte';
	import user from '$lib/stores/user.svelte';
	import { appearance, options } from '$lib/stripe';
	import { formatPrice } from '$lib/utils';

	const clientId = isDev ? PUBLIC_YAYTSO_STRIPE_CLIENT_ID_TEST : PUBLIC_YAYTSO_STRIPE_CLIENT_ID;
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
		try {
		const { clientSecret, error, paymentIntentId } = await checkoutApi.createPaymentIntent({ cart, user });
		// @ts-ignore
		stripe = Stripe(clientId);
		if (!stripe) {
			alert('Stripe failed to load. Bug Ari if it persists');
			return;
		}
		elements = stripe.elements({ clientSecret, appearance });
		const paymentElement = elements.create('payment', options);
		paymentElement.mount('#payment-element');
		paymentElement.on('ready', () => {
			paymentElementLoaded = true;
			console.log('Payment Element is fully loaded.');
			setTimeout(() => {
				if (browser && window.innerWidth < 768) {
					document.getElementById('payment-element')?.scrollIntoView({ behavior: 'smooth' });
				}
			}, 100);
		});
	} catch (/** @type {*} */ e) {
		console.error(e);
		alert(`Failed to create payment intent: ${e.message}`);
	}
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
		document.cookie = `generate=true; path=/; max-age=300`;

		const { error } = await stripe.confirmPayment({
			elements: elements,
			confirmParams: {
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

<div class="mb-10">
	<div class="px-5">
		<div class="max-w-[600px] p-0 text-xs">
			<div class="flex gap-4">
				<div>{user.state.fullName}</div>
				<div>{user.state.phoneNumber.number}</div>
			</div>
			<div class="mt-2 flex items-center gap-4">
				<div>{user.state.email}</div>
				<a class="text-xs text-[var(--color-2)] capitalize underline" href="/checkout/info">Edit</a>
			</div>
		</div>
	</div>
	<div class="payment-container mx-auto">
		<div id="payment-element" class="payment-element">
			<div class="loading-animation">
				<div class="spinner"></div>
				<div class="loading-text">Loading</div>
			</div>
		</div>
		<button
			onclick={onPay}
			disabled={!paymentElementLoaded}
			class="btn-bauhaus m-auto mt-4 block w-9/12"
			>{fetching ? 'Loading...' : `Pay ${formatPrice(cart.state.total)}`}</button
		>
	</div>
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
		@apply text-lg font-bold tracking-wide text-[var(--secondary-color)] uppercase;
	}

	.total {
		@apply text-xl font-extrabold tracking-wide text-[var(--color-1)] uppercase;
	}

	/* Payment element area styling */
	.payment-element {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		height: 300px;
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
		border-top-color: #d037ff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	/* Loading text styling */
	.loading-text {
		color: #000000;
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
