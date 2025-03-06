<script>
	import { goto } from '$app/navigation';
	import SliderPage from '$lib/compontents/checkout/slider-page.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	if (data.featured?.priceConfig.slidingScale === false) {
		goto('/checkout/info');
	}
</script>

<SliderPage />