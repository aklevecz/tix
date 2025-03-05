<script>
	import cart from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils';

	let { featured } = $props();

	let quantityInCart = $derived(featured ? cart.getQuantity(featured.id) : 0);

	let quantityMessage = $state('');

	/** @type {{[key: number]: string}} */
	let quantityMessageMap = {
		0: 'Tap add ticket if you wanna go!',
		1: "Didn't your friend want to come too?",
		2: 'And your other friend?',
		3: 'Oh and your other friend?',
		4: 'And one of their friends?'
	};

	$effect(() => {
		quantityMessage = quantityMessageMap[quantityInCart];
        if (quantityInCart > 4) {
            quantityMessage = 'You have a lot of friends';
        }
	});
</script>

<div class="flex flex-col gap-4 px-3">
	<!-- <h1>{featured?.title}</h1> -->
	{#if featured}
		<img class="hero-img w-200" src={featured?.img} alt="literally underground" />
		<div class="text-lg font-semibold">
			{featured.title} @ {featured.place.name}
		</div>
		<div class="desc">
			{featured?.description}
		</div>

		<div class="quantity-message">
			{quantityMessage}
		</div>
		<button onclick={() => cart.add(featured)} class="btn-bauhaus">
			Add {quantityInCart ? 'More' : formatPrice(featured.price)}
			{featured.productType}
		</button>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";

	h1 {
		@apply text-lg font-semibold;
	}
	.desc {
		@apply text-sm capitalize;
	}
	.quantity-message {
		@apply m-1 text-center text-base font-bold;
	}
	img.hero-img {
	}
</style>
