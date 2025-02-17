<script>
	import cart from '$lib/stores/cart.svelte';
	import { fade } from 'svelte/transition';

	let discountCode = $state('');
	let discountIsOpen = $state(false);
	function toggleDiscount() {
		message = '';
		discountIsOpen = !discountIsOpen;
	}

	/** @param {*} e */
	function onDiscountInput(e) {
		discountCode = e.currentTarget.value;
	}

	let message = $state('');
	async function submitDiscount() {
		const discount = await cart.applyDiscount(discountCode);
		toggleDiscount();
		if (discount === 0) {
			message = 'Invalid discount code';
		}
	}
</script>

<div>
	{#if cart.state.discount}
		<div class="p-2 text-center text-[var(--green)]">
			Discount applied! {cart.state.discount}%
		</div>
	{/if}
	{#if !discountIsOpen}
		<button onclick={toggleDiscount} class="btn-bauhaus discount">Discount Code?</button>
	{/if}

	{#if discountIsOpen}
		<div class="flex flex-col gap-2">
			<input oninput={onDiscountInput} placeholder="Discount Code" /><button
				class="btn-bauhaus"
				onclick={submitDiscount}>Submit</button
			>
		</div>
	{/if}
	{#if message}
		<div transition:fade class="mt-2 text-[var(--red)]">
			{message}
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	input {
		@apply w-full flex-1 border border-[var(--secondary-color)] bg-transparent p-2 text-[var(--secondary-color)] focus:border-[var(--color-2)] focus:outline-none;
	}
	button.btn-bauhaus {
		@apply text-xs;
	}
	button.discount {
		@apply m-auto block text-xs;
	}
</style>
