<script>
	import Slider from '$lib/compontents/checkout/slider.svelte';
		/** @type {{priceConfig: PriceConfig}}*/
	let { priceConfig } = $props();
</script>
<div id="slider-page-container" class="flex flex-1 flex-col">
	<div class="mx-auto mt-4 flex w-full flex-1 flex-col gap-2 px-8">
		<!-- <Slider min={priceConfig.min + pricing.state.increase} max={priceConfig.max} step={priceConfig.step} value={priceConfig.base + pricing.state.increase} /> -->
		<Slider min={priceConfig.min} max={priceConfig.max} step={priceConfig.step} value={priceConfig.base} />
		<p class="small">If you would like to contribute more or less slide to your ideal price.</p>
	</div>
	<a
		href="/checkout/info"
		class="btn-bauhaus mx-auto mt-12 mb-4 block w-[175px] text-center text-xl"
	>
		CONTINUE
	</a>
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	p.small {
		@apply text-sm lowercase;
	}
</style>
