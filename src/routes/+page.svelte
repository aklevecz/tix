<script>
	import CartContainer from '$lib/compontents/cart/cart-container.svelte';
	import cart from '$lib/stores/cart.svelte.js';

	const { data } = $props();
	const { featured } = data;

	let quantityInCart = $derived(featured ? cart.getQuantity(featured.id) : 0);
</script>

<div class="flex min-h-[100vh] flex-col gap-4 p-2 p-4">
	<!-- <h1>{featured?.title}</h1> -->
	{#if featured}
		<img class="hero-img w-200" src={featured?.img} alt="literally underground" />
		<div class="capitalize">
			{featured?.description}
		</div>
		<div class="text-center font-bold text-3xl m-4">
			{quantityInCart}
		</div>
		<button onclick={() => cart.add(featured)} class="btn-bauhaus">
			Add {quantityInCart ? 'More' : ''}
			{featured.productType}
		</button>
	{/if}
</div>
<CartContainer />

<style lang="postcss">
	@reference "tailwindcss/theme"
	img.hero-img {
	}
</style>
