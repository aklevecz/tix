<script>
	import cart from '$lib/stores/cart.svelte';
	import { fade, slide } from 'svelte/transition';

	let hasInteracted = $state(false);

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

	$effect(() => {
		if (message) {
			setTimeout(() => {
				message = '';
			}, 1000);
		}
	});
</script>

<div class="flex w-full items-center justify-between gap-2">
	{#if !cart.state.discount && !discountIsOpen}<div class="mb-1 text-xs font-semibold">
			Have a discount code?
		</div>{/if}
	{#if cart.state.discount}
		<div class="mb-2 text-[var(--green)]">
			Discount applied! {cart.state.discount}%
		</div>
	{/if}
	{#if !discountIsOpen}
		<button onclick={toggleDiscount} class="btn-bauhaus discount">Discount</button>
	{/if}

	{#if discountIsOpen}
		<div class="flex w-full justify-between gap-6">
			<input oninput={onDiscountInput} placeholder="Discount Code" /><button
				class="btn-bauhaus"
				onclick={submitDiscount}>Submit</button
			>
		</div>
	{/if}
</div>
{#if message}
	<div transition:slide class="mt-2 text-center font-bold text-[var(--red)]">
		{message}
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	input {
		@apply w-full flex-1 border border-[var(--secondary-color)] bg-transparent p-2 text-sm text-[var(--secondary-color)] focus:border-[var(--color-2)] focus:outline-none;
	}
	button.btn-bauhaus {
		@apply text-xs;
	}
	button.discount {
		@apply block text-xs;
	}
</style>
