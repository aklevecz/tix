<script>
	import { goto } from '$app/navigation';
	import {
		PUBLIC_SQUARE_APPLICATION_ID,
		PUBLIC_SQUARE_APPLICATION_ID_TEST
	} from '$env/static/public';
	import { colors, isDev } from '$lib';
	import checkoutApi from '$lib/api/checkout';
	import cart from '$lib/stores/cart.svelte';
	import generate from '$lib/stores/generate.svelte';
	import user from '$lib/stores/user.svelte';
	import { formatPrice } from '$lib/utils';
	import { onMount } from 'svelte';

	let { theme } = $props();

	const locationId = isDev ? 'LCGAF8NYM7C23' : 'LA6PWVD0KD3Z9';
	const appId = isDev ? PUBLIC_SQUARE_APPLICATION_ID_TEST : PUBLIC_SQUARE_APPLICATION_ID;

	let loading = $state(false);
	let fetching = $state(false);

	/** @type {CardPaymentMethod|null} */
	let card = $state(null);

	/** @type {ApplePayMethod|null} */
	let applePay = $state(null);

	/** @type {GooglePayMethod|null} */
	let googlePay = $state(null);
	let googlePayLoaded = $state(true);

	let orderId = $state('');

	onMount(() => {
		/**
		 * Initialize the Square card payment method
		 * @param {Payments} payments - The Square payments object
		 * @returns {Promise<CardPaymentMethod>} The card payment method
		 */
		async function initializeCard(payments) {
			const darkModeCardStyle = {
				'.input-container': {
					borderColor: 'white',
					borderRadius: '12px'
				},
				'.input-container.is-focus': {
					borderColor: '#006AFF'
				},
				'.input-container.is-error': {
					borderColor: '#ff1600'
				},
				'.message-text': {
					color: '#999999'
				},
				'.message-icon': {
					color: '#999999'
				},
				'.message-text.is-error': {
					color: '#ff1600'
				},
				'.message-icon.is-error': {
					color: '#ff1600'
				},
				input: {
					backgroundColor: theme.primaryColor,
					color: theme.secondaryColor,
					fontSize: '24px',
					fontFamily: 'helvetica neue, sans-serif'
				},
				'input::placeholder': {
					color: '#fff'
				},
				'input.is-error': {
					color: '#ff1600'
				},
				'@media screen and (max-width: 600px)': {
					input: {
						fontSize: '18px'
					}
				}
			};
			const card = await payments.card({ style: darkModeCardStyle });
			await card.attach('#card-container');
			return card;
		}

		async function init() {
			loading = true;
			if (!window.Square) {
				alert('Error loading Square -- try reloading the page');
				throw new Error('Square.js failed to load properly');
			}

			/** @type {Payments} */
			const payments = window.Square.payments(appId, locationId);
			// let card;
			try {
				card = await initializeCard(payments);
			} catch (e) {
				console.error('Initializing Card failed', e);
				return;
			}

			try {
				applePay = await initializeApplePay(payments);
			} catch (e) {
				console.error('Initializing Apple Pay failed', e);
			}

			try {
				googlePay = await initializeGooglePay(payments);
				googlePayLoaded = true
				console.log(`Google Pay initialized: ${googlePay}`);
			} catch (e) {
				console.error('Initializing Google Pay failed', e);
			}
			loading = false;
		}

		init();
	});

	/** @param {number} price */
	function toPaymentString(price) {
		return String((price / 100).toFixed(2));
	}

	/**
	 * Build a payment request object
	 * @param {Payments} payments - The Square payments object
	 * @returns {PaymentRequest} The payment request
	 */
	function buildPaymentRequest(payments) {
		return payments.paymentRequest({
			countryCode: 'US',
			currencyCode: 'USD',
			total: {
				amount: toPaymentString(cart.state.total),
				label: 'Total'
			}
		});
	}

	/**
	 * Initialize Google Pay
	 * @param {Payments} payments - The Square payments object
	 * @returns {Promise<GooglePayMethod>} The Google Pay payment method
	 */
	async function initializeGooglePay(payments) {
		const paymentRequest = buildPaymentRequest(payments);

		const googlePay = await payments.googlePay(paymentRequest);
		await googlePay.attach('#google-pay-button');

		return googlePay;
	}

	/**
	 * Initialize Apple Pay
	 * @param {Payments} payments - The Square payments object
	 * @returns {Promise<ApplePayMethod>} The Apple Pay payment method
	 */
	async function initializeApplePay(payments) {
		const paymentRequest = buildPaymentRequest(payments);
		const applePay = await payments.applePay(paymentRequest);
		// Note: You don't need to `attach` applePay.
		return applePay;
	}

	/** @param {string} token */
	async function createPayment(token) {
		const paymentResponse = await checkoutApi.createPaymentSquare({
			cart: cart.state,
			user: user.state,
			token,
			locationId
		});
		if (paymentResponse.ok) {
			return paymentResponse.json();
		}
		const errorBody = await paymentResponse.text();
		throw new Error(errorBody);
	}

	/**
	 * Tokenize a payment method
	 * @param {PaymentMethod} paymentMethod - The payment method to tokenize
	 * @returns {Promise<string>} The payment token
	 */
	async function tokenize(paymentMethod) {
		const tokenResult = await paymentMethod.tokenize();
		if (tokenResult.status === 'OK' && tokenResult.token) {
			return tokenResult.token;
		} else {
			let errorMessage = `Tokenization failed-status: ${tokenResult.status}`;
			if (tokenResult.errors) {
				errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
			}
			throw new Error(errorMessage);
		}
	}

	/** @param {string} status */
	function displayPaymentResults(status) {
		console.log(status);
		//    const statusContainer = document.getElementById(
		//      'payment-status-container'
		//    );
		//    if (status === 'SUCCESS') {
		//      statusContainer.classList.remove('is-failure');
		//      statusContainer.classList.add('is-success');
		//    } else {
		//      statusContainer.classList.remove('is-success');
		//      statusContainer.classList.add('is-failure');
		//    }

		//    statusContainer.style.visibility = 'visible';
	}

	/**
	 * Handle payment method submission
	 * @param {Event} event - The triggering event
	 * @param {PaymentMethod|null} paymentMethod - The payment method to use
	 */
	async function handlePaymentMethodSubmission(event, paymentMethod) {
		fetching = true;
		event.preventDefault();
		// const paymentMethod = card;
		if (!paymentMethod) {
			console.log('Missing payment method');
			return;
		}
		try {
			// disable the submit button as we await tokenization and make a
			// payment request.
			// cardButton.disabled = true;
			const token = await tokenize(paymentMethod);
			const paymentResults = await createPayment(token);
			displayPaymentResults('SUCCESS');
			orderId = paymentResults.orderId;
			generate.generateCD();
			goto(`/receipt/?square_order_id=${orderId}`);

			console.debug('Payment Success', paymentResults);
		} catch (/** @type {*} */ e) {
			// cardButton.disabled = false;
			displayPaymentResults('FAILURE');
			console.error(e.message);
		}
		fetching = false;
	}
</script>

<div class="relative">
	{#if loading}
		<div
			class="absolute flex h-full min-h-[200px] w-full items-center justify-center text-2xl font-bold"
		>
			Loading...
		</div>{/if}
	<form id="payment-form">
		{#if applePay}
			<div id="apple-pay-wrapper">
				<div
					aria-label="apple pay button"
					role="button"
					tabindex="0"
					onclick={(e) => handlePaymentMethodSubmission(e, applePay)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handlePaymentMethodSubmission(e, applePay);
						}
					}}
					id="apple-pay-button"
				></div>
			</div>
			<!-- <div class="m-2 text-center font-semibold">OR</div> -->
		{/if}
		{#if googlePayLoaded}
			<div
				aria-label="google pay button"
				role="button"
				tabindex="0"
				onclick={(e) => handlePaymentMethodSubmission(e, googlePay)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handlePaymentMethodSubmission(e, googlePay);
					}
				}}
				id="google-pay-button"
			></div>
			<!-- <div class="m-2 text-center font-semibold">OR</div> -->
		{/if}
		<!-- <div class="text-sm font-semibold">Credit Card</div> -->
		<div id="card-container"></div>
		{#if !loading}<button
				class="btn-bauhaus m-auto block"
				onclick={(e) => handlePaymentMethodSubmission(e, card)}
				id="card-button"
				type="button">{fetching ? 'Loading...' : `Pay ${formatPrice(cart.state.total)}`}</button
			>{/if}
	</form>
	<div id="payment-status-container"></div>
</div>

<style>
	#apple-pay-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		padding: 3px;
		margin-bottom: 1rem;
		border-radius: 5px;
	}
	
	#apple-pay-button {
		height: 48px;
		width: 100%;
		display: inline-block;
		-webkit-appearance: -apple-pay-button;
		appearance: -apple-pay-butotn;
		-apple-pay-button-type: plain;
		-apple-pay-button-style: black;
	}

	#google-pay-button {
		display: flex;
		justify-content: center;
		margin: 1rem 0;
		width: 100%;
	}
</style>
