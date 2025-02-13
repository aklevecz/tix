<script>
	import cart from '$lib/stores/cart.svelte';

	/** @type {{product: Product}} */
	let { product } = $props();

	function addToCart() {
		cart.add(product);
	}
</script>

<div
	class="product-item flex flex-auto flex-col gap-3 border-[#DE0000] bg-transparent p-4 md:basis-[40%]"
>
	<h3 class="product-title">{product.title}</h3>
	<img src={product.img} alt={product.title} class="product-image py-0" />
	<p class="product-description">{product.description}</p>
	<button onclick={addToCart} class="btn-bauhaus"> Add to cart </button>
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	.product-item {
	}

	.product-title {
		@apply text-xl font-bold tracking-wide text-white uppercase;
	}

	.product-image {
		@apply h-auto w-full object-cover;
	}

	.product-description {
		@apply flex-grow text-sm text-gray-100;
	}
</style>
