<script>
	import { goto } from '$app/navigation';
	import CartLineItem from '$lib/compontents/cart/cart-line-item.svelte';
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
<div class="min-h-[83.1vh]">
	<div class="relative mb-8">
		<div class="absolute top-0 left-1 h-[20px] w-[20px] bg-[var(--red)]"></div>
		<h1 class="relative z-10 pl-2 text-5xl font-bold tracking-tight text-white uppercase">
			Checkout
		</h1>
	</div>

	<div class="card-base p-4 pt-0">
		<div class="relative">
			<!-- <div class="absolute -left-0 top-0 w-1 h-full bg-[var(--red)]"></div> -->
			<div class="space-y-4 px-2">
				{#each cart.getGroupedItems() as { item, quantity }}
					<CartLineItem {item} {quantity} />
				{/each}
			</div>
		</div>

		<div class="relative bg-[#1a1a1a] p-4">
			<!-- <div class="absolute top-0 right-0 h-6 w-6 bg-[var(--yellow)]"></div> -->
			<div class="mb-0 space-y-3">
				<h2 class="flex items-baseline justify-between text-lg text-gray-400">
					Subtotal<span class="text-white">{formatPrice(cart.state.subtotal)}</span>
				</h2>
				<h2 class="flex items-baseline justify-between text-lg text-gray-400">
					Discount<span class="text-white">-{cart.state.discount}% </span>
				</h2>
				<h2 class="flex items-baseline justify-between text-xl font-bold">
					Total<span class="text-[var(--red)]">{formatPrice(cart.state.total)}</span>
				</h2>
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
