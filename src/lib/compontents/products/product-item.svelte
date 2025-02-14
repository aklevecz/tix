<script>
	import cart from '$lib/stores/cart.svelte';
	import { formatDate } from '$lib/utils';

	/** @type {{product: Product}} */
	let { product } = $props();

	function addToCart() {
		cart.add(product);
	}

	let selectedDate = $state(product.dates[0]);

    /** @param {string} date */
	function handleDateSelect(date) {
		selectedDate = date;
        cart.updateTicketDate(product.id,date);
	}
</script>

<div
	class="product-item flex flex-auto flex-col gap-3 border-[#DE0000] bg-transparent p-4 md:basis-[40%]"
>
	<h3 class="product-title">{product.title}</h3>
	<img src={product.img} alt={product.title} class="product-image py-0" />
	<p class="product-description">{product.description}</p>
    <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
            {#each product.dates as date, index}
                <button 
                    onclick={() => handleDateSelect(date)} 
                    class:selected={selectedDate === date}
                    class="text-white hover:text-[#DE0000] transition-colors {selectedDate === date ? 'text-[#DE0000] font-bold' : ''}"
                >
                    {formatDate(date)}
                </button>
            {/each}
        </div>
    </div>
	<button onclick={addToCart} class="btn-bauhaus"> Add {product.productType} </button>
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	.product-item {
	}

	.product-title {
		@apply text-3xl font-bold tracking-wide text-white uppercase;
	}

	.product-image {
		@apply h-auto w-full object-cover;
	}

	.product-description {
		@apply flex-grow text-lg text-gray-100;
	}

    .selected {
        background-color: blue;
    }
</style>
