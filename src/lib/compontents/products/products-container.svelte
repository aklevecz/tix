<script>
	import { onMount } from 'svelte';
	import products from '$lib/stores/products.svelte';
	import ProductItem from './product-item.svelte';

	onMount(() => {
		products.init();
	});
</script>

<div class="products-container flex flex-wrap gap-2">
	{#each products.state as product}
        <ProductItem {product} />
	{/each}
</div>
