<script>
	import cart from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils';
	import CartLineItem from './cart-line-item.svelte';

	let hasItems = $derived(Object.entries(cart.state.items).length);
</script>

{#if hasItems}
	<div class="cart-container sticky top-0 mb-2 grid gap-4 border bg-black p-2 border-[white]">
		<div class="max-h-[calc(80vh-6rem)] space-y-3 overflow-y-auto pr-2">
			{#each cart.getGroupedItems() as { item, quantity }}
				<CartLineItem {item} {quantity} />
			{/each}
		</div>
		<div class="flex items-center justify-between pt-1">
			<div class="border-t border-[var(--red)]/20 pt-0 text-sm font-medium text-white">
				Total: {formatPrice(cart.state.total)}
			</div>
			<a class="btn-bauhaus" href="/checkout" aria-label="Checkout">Checkout</a>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";

    a.btn-bauhaus {
        @apply text-xs px-2 py-1;
    }
	a.btn-bauhaus:hover {
		@apply bg-white text-[var(--red)];
	}
</style>
