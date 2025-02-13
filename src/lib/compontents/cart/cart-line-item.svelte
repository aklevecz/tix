<script>
	import cart from '$lib/stores/cart.svelte';
	let { item, quantity } = $props();

	function onRemove() {
		cart.remove(item);
	}
</script>

<div class="cart-line-item">
	<div class="cart-line-item__title">
		<span class="cart-line-item__quantity">{quantity}</span>{item.title}
	</div>
	<button class="btn-outline" onclick={onRemove} aria-label={`Remove ${item.title} from cart`}>
		<svg viewBox="0 0 12 2" width="8" height="2">
			<line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" stroke-width="2" />
		</svg>
	</button>
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";

	.cart-line-item {
		@apply flex items-center justify-between gap-2 text-sm text-gray-100 transition-colors hover:text-white;
	}

	/* Title section that truncates long text */
	.cart-line-item__title {
		@apply flex-1 truncate;
	}

	/* Use the checkout red accent for the quantity */
	.cart-line-item__quantity {
		@apply text-[var(--red)] pr-1 font-bold;
	}
</style>
