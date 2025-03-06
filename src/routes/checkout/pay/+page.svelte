<script>
	import SquarePay from '$lib/compontents/square/square-pay.svelte';
	import StripePay from '$lib/compontents/stripe/stripe-pay.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<div class="flex flex-col justify-center bg-red">
	<h1>Payment</h1>
	{#if data.paymentType === 'square'}
		<SquarePay />
	{/if}

	{#if data.paymentType === 'stripe'}
		<StripePay />
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";

	h1 {
		@apply mb-2 text-2xl font-bold;
	}
</style>
