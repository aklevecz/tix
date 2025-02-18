<script>
	import cart from '$lib/stores/cart.svelte';

	// import { onMount } from 'svelte';
	import products from '$lib/stores/products.svelte';
	import { fade } from 'svelte/transition';
	import ProductItem from './product-item.svelte';

	// onMount(() => {
	// 	products.init();
	// });
</script>

<div class="products-container mb-4 flex flex-wrap gap-20">
	{#each products.state as product}
		<ProductItem {product} />
	{/each}
</div>
{#if cart.getGroupedItems().length > 0}
	<div class="flex flex-col items-center gap-2 justify-around mt-8">
		<div class="font-semibold text-center lowercase">Psst you got some stuff in your cart to check out :)</div>
		<a href="/checkout" aria-label="Checkout" transition:fade class="btn-bauhaus"
			>CHECK OUT</a
		>
	</div>
{/if}
