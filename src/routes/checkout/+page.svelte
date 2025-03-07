<script>
	import { goto } from '$app/navigation';
	import SliderPage from '$lib/compontents/checkout/slider-page.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	console.log(data.featured?.id);
	if (data.featured?.priceConfig.slidingScale === false) {
		goto('/checkout/info');
	}
</script>

<SliderPage />
