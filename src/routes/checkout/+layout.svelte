<script>
	import { goto } from '$app/navigation';
	import CartLineItem from '$lib/compontents/cart/cart-line-item.svelte';
	import Discount from '$lib/compontents/checkout/discount.svelte';
	import cart from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils';

	/** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
	let { children } = $props();

	$effect(() => {
		if (cart.state.id && Object.entries(cart.state.items).length === 0) {
			alert('Your cart is empty, moving you back to the home page');
			goto('/');
		}
	});
</script>

<svelte:head>
	<script src="https://js.stripe.com/v3/"></script>
</svelte:head>

<div class="max-w-[800px] mx-auto min-h-[80vh] flex flex-col">
	<div class="mb- relative">
		<!-- <div class="absolute top-0 left-1 h-[20px] w-[20px] bg-[var(--color-2)]"></div> -->
		<h1
			class="relative z-10 pl-2 text-xl font-bold tracking-tight text-[var(--secondary-color)] uppercase"
		>
			Checkout
		</h1>
	</div>

	<div class="card-base max-w-[600px] mx-auto p-4 pt-0">
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
			<div class="justify- mx- mt-4 mb- flex flex-col px-">
				<Discount />
			</div>
		</div>
	</div>
	{@render children()}
</div>

<!-- <button
	onclick={() => {
		cart.applyDiscount(50);
	}}>DISCOUNT 50</button
> -->
