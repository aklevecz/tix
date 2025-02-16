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
			<a class="btn-bauhaus" href="/checkout" aria-label="Checkout">Checkout</a>
			<div class="total">
				Total {formatPrice(cart.state.total)}
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";

	.cart-container {
		/* margin-left: -10px; */
		width: 98%;
		@apply sticky top-0 mb-2 grid gap-2  bg-[var(--primary-color)] p-2;
		/* @apply border border-[var(--secondary-color)]; */
	}

	.cart-item-wrapper {
		@apply max-h-[calc(80vh-6rem)] space-y-3 overflow-y-auto pr-2;
	}

	.total {
		@apply border-[var(--color-1)]/20 pt-0 text-lg leading-[1rem] font-medium text-[var(--secondary-color)] mb-[10px];
	}

	a.btn-bauhaus {
		@apply px-2 py-1 text-xs my-2;
	}
</style>
