<script>
	import SquarePay from '$lib/compontents/square/square-pay.svelte';
	import StripePay from '$lib/compontents/stripe/stripe-pay.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

{#if data.paymentType === 'square'}
	<SquarePay />
{/if}

{#if data.paymentType === 'stripe'}
	<StripePay />
{/if}
