<script>
	import ProductsContainer from '$lib/compontents/products/products-container.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<ProductsContainer />
