<script>
	import { slide } from 'svelte/transition';

	import cart from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils';
	import CartLineItem from './cart-line-item.svelte';

	let hasItems = $derived(Object.entries(cart.state.items).length);

	const pushHeight = 100;

	$effect(() => {
		if (hasItems) {
			setTimeout(() => {
				window.scrollTo({
					// top: pushHeight,
					top: window.innerHeight + pushHeight,
					left: 0,
					behavior: 'smooth'
				});
			}, 100);
		}
	});
</script>

{#if hasItems}
	<div style="height: {pushHeight}px"></div>

	<div class="cart-container" transition:slide>
		<div class="cart-item-wrapper">
			{#each cart.getGroupedItems() as { item, quantity }}
				<CartLineItem {item} {quantity} price={item.price} />
			{/each}
		</div>
		<div class="flex items-end justify-between gap-6 border-t">
			<div class="total">
				Total {formatPrice(cart.state.total)}
			</div>
			<a class="checkout btn-bauhaus" href="/checkout" aria-label="Checkout">Checkout</a>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";

	.cart-container {
		/* margin-left: -10px; */
		@apply fixed bottom-0 md:bottom-20 md:left-10 mt-4 mb-0 grid w-full gap-2 bg-[var(--primary-color)] p-2 px-3 md:mb-0 md:w-[500px] md:rounded-md md:border md:p-4;
		/* @apply border border-[var(--secondary-color)]; */
	}

	.cart-item-wrapper {
		@apply max-h-[calc(80vh-6rem)] space-y-3 overflow-y-auto pr-2;
	}

	.total {
		@apply mb-1 border-[var(--color-1)]/20 pt-0 pb-1 text-2xl leading-[1rem] font-medium text-[var(--secondary-color)] md:mt-12 md:text-2xl;
	}

	a.btn-bauhaus {
		@apply mt-2 mb-0 px-3 py-2 text-sm;
	}

	a.checkout {
		@apply mt-4 md:text-2xl;
	}
</style>
