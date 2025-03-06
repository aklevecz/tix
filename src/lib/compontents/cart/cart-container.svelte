<script>
	import {slide} from 'svelte/transition'

	import cart from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils';
	import CartLineItem from './cart-line-item.svelte';

	let hasItems = $derived(Object.entries(cart.state.items).length);
</script>

{#if hasItems}
	<div class="cart-container" transition:slide>
		<div class="cart-item-wrapper">
			{#each cart.getGroupedItems() as { item, quantity }}
				<CartLineItem {item} {quantity} price={item.price}/>
			{/each}
		</div>
		<div class="flex justify-between items-end gap-6 border-t">
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
		@apply  mt-4 w-full bottom-0 mb-0 grid gap-2  bg-[var(--primary-color)] p-2 px-3 md:mb-0 md:w-[500px] md:rounded-md md:border md:p-4;
		/* @apply border border-[var(--secondary-color)]; */
	}

	.cart-item-wrapper {
		@apply max-h-[calc(80vh-6rem)] space-y-3 overflow-y-auto pr-2;
	}

	.total {
		@apply border-[var(--color-1)]/20 pt-0 text-lg leading-[1rem] font-medium text-[var(--secondary-color)] mb-1 md:text-2xl md:mt-12;
	}

	a.btn-bauhaus {
		@apply px-3 py-2 text-sm mb-0 mt-2;
	}

	a.checkout {
		@apply md:text-2xl;
	}
</style>
