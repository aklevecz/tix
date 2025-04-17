<script>
	import cart from '$lib/stores/cart.svelte';
	import { formatDate, formatPrice } from '$lib/utils';

	let { item, quantity, price } = $props();

	function onRemove() {
		cart.remove(item);
	}

	function onAdd() {
		cart.add(item);
	}
</script>

<div class="cart-line-item">
	<div class="cart-line-item__title">
		<!-- <span class="cart-line-item__quantity">{quantity}<span class="text-[var(--color-2)] lowercase mx-[2px]">x</span>{formatPrice(price)}</span>{item.title}{" "}({formatDate(item.date).split(',')[0]}) -->
		<span class="cart-line-item__quantity">{quantity} {item.productType}{quantity > 1 ? 's' : ''}</span><br/>{item.cartTitle}{" "}({formatDate(item.date).split(',')[0]})
	</div>
	<button class="btn-outline" onclick={onRemove} aria-label={`Remove ${item.title} from cart`}>
		<svg viewBox="0 0 12 2" width="8" height="2">
			<line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" stroke-width="2" />
		</svg>
	</button>
	<button class="btn-outline" onclick={onAdd} aria-label={`add ${item.title} to the cart`}>
		<svg viewBox="0 0 12 2" width="8" height="8">
			<line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" stroke-width="2" />
			<line x1="6" y1="-6" x2="6" y2="7" stroke="currentColor" stroke-width="2" />
		</svg>
	</button>
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";

	button.btn-outline {
	}

	.cart-line-item {
		@apply flex items-center gap-2 text-sm transition-colors hover:text-[var(--secondary-color)];
	}

	.cart-line-item__title {
		@apply flex-[1_2_80%] text-sm break-words text-[var(--secondary-color)];
	}

	.cart-line-item__quantity {
		@apply pr-1 font-bold text-[var(--third-color)] text-lg;
	}
</style>
