<script>
	import cart from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { slide } from 'svelte/transition';

	let { featured } = $props();

	let quantityInCart = $derived(featured ? cart.getQuantity(featured.id) : 0);

	let quantityMessage = $state('');

	/** @type {HTMLButtonElement | null} */
	let floatingButton = $state(null)

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

	let spring = new Spring(0)

	onMount(() => {
		window.addEventListener('scroll', () => {
			spring.target = window.scrollY
		})
	})
</script>

<div class="md:flex mx-auto mb-10 flex min-h-[50vh] max-w-[900px] flex-col gap-4 px-3">
	<button bind:this={floatingButton} style="transform: translateY({spring.current}px)" onclick={() => cart.add(featured)} class="btn-bauhaus fixed bottom-4 right-4">
		Add {quantityInCart ? 'More' : formatPrice(featured.price)}
		{featured.productType}
	</button>
	<!-- <h1>{featured?.title}</h1> -->
	{#if featured}
		<div class="md:flex md:gap-4 flex-[1_0_auto]">
			<!-- <img class="hero-img" src={featured?.img} alt="literally underground" /> -->
			<!-- <img src="raptor/raptor-red-svg.svg" alt="raptor" class="hero-img" /> -->
			<img class="hero-img" src={featured?.img} alt="bazaar scene" />
			<div class="mt-4">
				<div class="flex items-center gap-4">
					<!-- <img class="w-[80px]" src="/images/faight/faight-logo.png" alt="faight logo" /> -->
					<div class="text-xl font-semibold tracking-wide capitalize flex items-center flex-wrap gap-2 mb-2">
						{@html featured.title}
					</div>
				</div>
				<div class="desc">
					{@html featured?.description}
				</div>
			</div>
		</div>
		
		<!-- <div class="quantity-message">
			{quantityMessage} p
		</div> -->
		<div class="flex h-full flex-col justify-center gap-4 md:mt-0">
			<!-- <div class="lower mb-4 px-4 text-center text-3xl text-[var(--third-color)]">
				There is a free ticket every day at a random time in the afternoon
			</div> -->

			<button onclick={() => cart.add(featured)} class="btn-bauhaus">
				Add {quantityInCart ? 'More' : formatPrice(featured.price)}
				{featured.productType}
			</button>
			<!-- {#if quantityInCart}
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
		animation: pulse 4s ease-in-out infinite;
		@apply mx-auto w-[100%] md:w-[400px] md:h-[400px] my-4 rounded-lg;
	}
	.btn-bauhaus {
		@apply mx-auto w-[250px];
	}
	@keyframes pulse {
		0% {
			/* transform: scale(1); */
			opacity: 1;
			filter: hue-rotate(0deg);
		}
		50% {
			/* transform: scale(1.01); */
			opacity: 0.9;
			filter: hue-rotate(90deg);
		}
	}
</style>
