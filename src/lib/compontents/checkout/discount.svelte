<script>
	import cart from '$lib/stores/cart.svelte';

	let discountCode = $state('');
	let discountIsOpen = $state(false);
	function toggleDiscount() {
		discountIsOpen = !discountIsOpen;
	}

	/** @param {*} e */
	function onDiscountInput(e) {
		discountCode = e.currentTarget.value;
	}

	function submitDiscount() {
		cart.applyDiscount(discountCode);
	}
</script>

{#if cart.state.discount}
	<div class="p-2 text-center text-[var(--green)]">
		Discount applied! {cart.state.discount}%
	</div>
{/if}

{#if !discountIsOpen}
	<button onclick={toggleDiscount} class="btn-bauhaus discount">Discount Code?</button>
{/if}



{#if discountIsOpen}
	<div class="flex gap-2">
		<input oninput={onDiscountInput} placeholder="Discount Code" /><button
			class="btn-bauhaus"
			onclick={submitDiscount}>Submit</button
		>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	input {
		@apply w-1/2 flex-1 border border-[var(--secondary-color)] bg-transparent p-2 text-[var(--secondary-color)] focus:border-[var(--color-2)] focus:outline-none;
	}

	button.discount {
		@apply text-sm w-60 mx-auto;
	}
</style>
