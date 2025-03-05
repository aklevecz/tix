<script>
	import Slider from '$lib/compontents/checkout/slider.svelte';
</script>

<div id="slider-page-container" class="flex flex-col flex-1">
	<div class="mx-auto mt-4 flex w-full flex-1 flex-col gap-2 px-8">
		<Slider />
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
