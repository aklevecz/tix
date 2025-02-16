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

<div class="products-container flex flex-wrap gap-20">
	{#each products.state as product}
        <ProductItem {product} />
	{/each}
	{#if cart.getGroupedItems().length > 0}
		<a href="/checkout" aria-label="Checkout" transition:fade class="btn-bauhaus mx-auto">CHECK OUT</a>
	{/if}
</div>
