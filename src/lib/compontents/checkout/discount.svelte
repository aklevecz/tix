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

<div class="flex gap-2">
	<input oninput={onDiscountInput} /><button onclick={submitDiscount}>Submit</button>
</div>
{#if cart.state.discount}
	<div class="p-2 pb-0 text-center text-lime-300">Discount applied! {cart.state.discount}%</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	input {
		@apply w-1/2 flex-1 border border-white bg-transparent p-2 text-white focus:border-[var(--red)] focus:outline-none;
	}
</style>
