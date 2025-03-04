<script>
	import { dev } from '$app/environment';
	import {
		PUBLIC_SQUARE_APPLICATION_ID,
		PUBLIC_SQUARE_APPLICATION_ID_TEST
	} from '$env/static/public';
	import StripePay from '$lib/compontents/stripe/stripe-pay.svelte';
	import { onMount } from 'svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	const locationId = 'LCGAF8NYM7C23';
	const appId = dev ? PUBLIC_SQUARE_APPLICATION_ID_TEST : PUBLIC_SQUARE_APPLICATION_ID;

	let card = $state(null);
	let applePay = $state(null);

	onMount(() => {
		async function initializeCard(payments) {
			const card = await payments.card();
			await card.attach('#card-container');
			return card;
		}

		async function init() {
			if (!window.Square) {
				throw new Error('Square.js failed to load properly');
			}
			const payments = window.Square.payments(appId, locationId);
			// let card;
			try {
				card = await initializeCard(payments);
				console.log(card);
			} catch (e) {
				console.error('Initializing Card failed', e);
				return;
			}

			try {
				applePay = await initializeApplePay(payments);
			} catch (e) {
				console.error('Initializing Apple Pay failed', e);
				// There are a number of reason why Apple Pay might not be supported.
				// (such as Browser Support, Device Support, Account). Therefore you should
				// handle
				// initialization failures, while still loading other applicable payment
				// methods.
			}

			// Step 5.2: create card payment
		}

		init();
	});

	function buildPaymentRequest(payments) {
		return payments.paymentRequest({
			countryCode: 'US',
			currencyCode: 'USD',
			total: {
				amount: '1.00',
				label: 'Total'
			}
		});
	}

	async function initializeApplePay(payments) {
		const paymentRequest = buildPaymentRequest(payments);
		const applePay = await payments.applePay(paymentRequest);
		// Note: You don't need to `attach` applePay.
		return applePay;
	}

	async function createPayment(token) {
		const body = JSON.stringify({
			locationId,
			sourceId: token,
			idempotencyKey: window.crypto.randomUUID()
		});
		const paymentResponse = await fetch('/api/checkout/square', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body
		});
		if (paymentResponse.ok) {
			return paymentResponse.json();
		}
		const errorBody = await paymentResponse.text();
		throw new Error(errorBody);
	}

	async function tokenize(paymentMethod) {
		const tokenResult = await paymentMethod.tokenize();
		if (tokenResult.status === 'OK') {
			return tokenResult.token;
		} else {
			let errorMessage = `Tokenization failed-status: ${tokenResult.status}`;
			if (tokenResult.errors) {
				errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
			}
			throw new Error(errorMessage);
		}
	}

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

	async function handlePaymentMethodSubmission(event) {
		event.preventDefault();
		const paymentMethod = card;

		try {
			// disable the submit button as we await tokenization and make a
			// payment request.
			// cardButton.disabled = true;
			console.log(paymentMethod);
			const token = await tokenize(paymentMethod);
			const paymentResults = await createPayment(token);
			displayPaymentResults('SUCCESS');

			console.debug('Payment Success', paymentResults);
		} catch (e) {
			// cardButton.disabled = false;
			displayPaymentResults('FAILURE');
			console.error(e.message);
		}
	}
</script>

<form id="payment-form">
	<div id="apple-pay-button"></div>
	<div id="card-container"></div>
	<button onclick={handlePaymentMethodSubmission} id="card-button" type="button">Pay $1.00</button>
</form>
<div id="payment-status-container"></div>
<!-- <StripePay /> -->
