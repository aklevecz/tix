<script>
	import SliderPage from '$lib/compontents/checkout/slider-page.svelte';
	import PriceCountdown from '$lib/compontents/price-countdown.svelte';
	import pricing from '$lib/stores/pricing.svelte';
	import { onMount } from 'svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	if (data.featured?.priceConfig.slidingScale === false) {
		// goto('/checkout/info');
	}

	// Start updates when component mounts, stop when it unmounts
	onMount(() => {
		pricing.startUpdates();
		return () => pricing.stopUpdates();
	});
</script>

{#if data.featured?.priceConfig.slidingScale === true}
	<SliderPage priceConfig={data.featured.priceConfig} />
{:else}
	<p class="m-2 text-center text-2xl font-bold">Looks good?</p>
	<a
		href="/checkout/info"
		class="btn-bauhaus mx-auto mt-12 mb-4 block w-[175px] text-center text-xl">CONTINUE</a
	>
{/if}
