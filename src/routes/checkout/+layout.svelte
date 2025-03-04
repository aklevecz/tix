<script>
	import { browser } from '$app/environment';
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import CartLineItem from '$lib/compontents/cart/cart-line-item.svelte';
	import Discount from '$lib/compontents/checkout/discount.svelte';
	import cart from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils';
	import { fade } from 'svelte/transition';

	/** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
	let { children } = $props();

	$effect(() => {
		if (cart.state.id && Object.entries(cart.state.items).length === 0) {
			alert('Your cart is empty, moving you back to the home page');
			goto('/');
		}
	});

	let route = $state('');
	beforeNavigate(() => {
		if (browser) {
			route = page.url.pathname;
		}
	});
</script>

<svelte:head>
	<script src="https://js.stripe.com/v3/"></script>
	<script type="text/javascript" src="https://sandbox.web.squarecdn.com/v1/square.js"></script>
	<script>
		// const appId = 'sandbox-sq0idb-GnSGYpfUxfSeUgc-RixoEA';
		// const locationId = 'LCGAF8NYM7C23';
		// async function initializeCard(payments) {
		// 	const card = await payments.card();
		// 	await card.attach('#card-container');
		// 	return card;
		// }

		// document.addEventListener('DOMContentLoaded', async function () {
		// 	if (!window.Square) {
		// 		throw new Error('Square.js failed to load properly');
		// 	}
		// 	const payments = window.Square.payments(appId, locationId);
		// 	let card;
		// 	try {
		// 		card = await initializeCard(payments);
		// 	} catch (e) {
		// 		console.error('Initializing Card failed', e);
		// 		return;
		// 	}

		// 	// Step 5.2: create card payment
		// });
	</script>
</svelte:head>

<div class="mx-auto flex max-w-[380px] flex-col">
	<div class="mb- relative">
		<!-- <div class="absolute top-0 left-1 h-[20px] w-[20px] bg-[var(--color-2)]"></div> -->
		<h1
			class="relative z-10 pl-2 text-xl font-bold tracking-tight text-[var(--secondary-color)] uppercase"
		>
			Checkout
		</h1>
	</div>

	<div class="card-base max-w-[600px] p-4 pt-0">
		<div class="relative">
			<!-- <div class="absolute -left-0 top-0 w-1 h-full bg-[var(--color-1)]"></div> -->
			<div class="mt-4 space-y-4 border-0 border-b-0 px-0">
				{#each cart.getGroupedItems() as { item, quantity }}
					<div class="border p-2">
						<CartLineItem {item} {quantity} price={item.price} />
					</div>
				{/each}
			</div>
		</div>

		<div class="relative mt-[-18px] border border-t p-4">
			<!-- <div class="absolute top-0 right-0 h-6 w-6 bg-[var(--color-2)]"></div> -->
			<div class="mb-0 space-y-1">
				<h2 class="flex items-baseline justify-between text-base text-gray-400">
					Subtotal<span class="text-[var(--secondary-color)]"
						>{formatPrice(cart.state.subtotal)}</span
					>
				</h2>
				{#if cart.state.discount}
					<h2 class="flex items-baseline justify-between text-base text-gray-400">
						Discount<span class="text-[var(--color-2)]">-{cart.state.discount}% </span>
					</h2>
				{/if}
				<h2 class="flex items-baseline justify-between text-base font-bold">
					Total<span class="text-[var(--secondary-color)]">{formatPrice(cart.state.total)}</span>
				</h2>
			</div>
			<div class="justify- mx- mb- px- mt-4 flex flex-col">
				<Discount />
			</div>
		</div>
	</div>
	<div class="page-container">
		{#key route}
			<div class="page" transition:fade>
				{@render children()}
			</div>
		{/key}
	</div>
</div>
<!-- <button
	onclick={() => {
		cart.applyDiscount(50);
	}}>DISCOUNT 50</button
> -->

<style>
	.page-container {
		position: relative;
		/* Optionally, set a min-height to avoid container collapse */
		min-height: 50vh; /* or a fixed height that matches your design */
	}
	.page {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* Ensure the element doesn’t affect layout during transitions */
	}
</style>
