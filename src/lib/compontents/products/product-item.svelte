<script>
	import cart from '$lib/stores/cart.svelte';
	import { formatDate, formatPrice } from '$lib/utils';

	/** @type {{product: Product}} */
	let { product } = $props();

	function addToCart() {
		if (selectedDate) {
			product.date = selectedDate;
		}
		cart.add(product);
	}

	let selectedDate = $state(product.dates[0]);

	/** @param {string} date */
	function handleDateSelect(date) {
		selectedDate = date;
		cart.updateTicketDate(product.id, date);
	}
</script>

<div class="product-item">
	<div class="flex">
		<h3 class="product-title">{product.title}</h3>
		<div>{formatPrice(product.price)}</div>
	</div>
	<div>{formatDate(product.date)}</div>
	{#if product.place}
		<div>
			<div class="product-place">{product.place.name}</div>
			<div>{product.place.address}</div>
		</div>
	{/if}
	<img src={product.img} alt={product.title} class="product-image py-0" />
	<p class="product-description">{product.description}</p>
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-4">
			{#if product.dates.length > 1}
				{#each product.dates as date, index}
					<button onclick={() => handleDateSelect(date)} class:selected={selectedDate === date}>
						{formatDate(date)}
					</button>
				{/each}
			{/if}
		</div>
	</div>
	<button onclick={addToCart} class="btn-bauhaus"> Add {product.productType} </button>
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	.product-item {
		@apply flex flex-auto flex-col gap-3 bg-transparent p-4 md:basis-[40%] max-w-[400px];
	}

	.product-title {
		@apply text-xl font-bold tracking-wide text-[var(--secondary-color)] uppercase;
	}

	.product-image {
		@apply h-auto w-full object-cover filter-[brightness(0%)];
	}

	.product-description {
		@apply flex-grow text-lg text-[var(--secondary-color)];
	}

	.selected {
		background-color: var(--color-2);
	}
</style>
