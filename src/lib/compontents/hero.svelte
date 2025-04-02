<script>
	import cart from '$lib/stores/cart.svelte';
	
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

<div class="mx-auto flex min-h-[50vh] max-w-[700px] flex-col gap-4 px-3 md:flex- mb-20">
	<!-- <h1>{featured?.title}</h1> -->
	{#if featured}
		<div class="flex-[1_0_auto]">
			<!-- <img class="hero-img" src={featured?.img} alt="literally underground" /> -->
			<!-- <img src="raptor/raptor-red-svg.svg" alt="raptor" class="hero-img" /> -->
			 <img class="hero-img" src="/raptor/dinotopia/bazaar-scene.jpeg" alt="bazaar scene">
			<div class="p-4">
				<div class="flex items-center gap-4">
					<!-- <img class="w-[80px]" src="/images/faight/faight-logo.png" alt="faight logo" /> -->
					<div class="text-2xl font-semibold tracking-wide capitalize">
						{featured.title}
					</div>
				</div>
				<div class="desc">
					{featured?.description}
				</div>
			</div>
		</div>
		<!-- <div class="quantity-message">
			{quantityMessage}
		</div> -->
		<div class="md:mt-0 flex h-full flex-col justify-center gap-4">
			<div class="text-3xl text-center lower mb-4 px-4 text-[var(--third-color)]">
				There is a free ticket every day at a random time in the afternoon
			</div>
			<a class="btn-bauhaus text-center" href="/freebee">Win a ticket</a>

			<!-- <button onclick={() => cart.add(featured)} class="btn-bauhaus">
				Add {quantityInCart ? 'More' : formatPrice(featured.price)}
				{featured.productType}
			</button>
			{#if quantityInCart}
				<button transition:slide onclick={() => cart.remove(featured)} class="btn-bauhaus">
					REMOVE
					{featured.productType}
				</button>{/if} -->
		</div>
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
		animation: pulse 2s ease-in-out infinite;
		@apply mx-auto  w-full;
	}
	.btn-bauhaus {
		@apply mx-auto w-[250px];
	}
	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 1;
			filter: hue-rotate(0deg);
		}
		50% {
			transform: scale(1.05);
			opacity: 0.7;
			filter: hue-rotate(180deg);
		}
	}
</style>
