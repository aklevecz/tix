<script>
	import Discount from '$lib/compontents/checkout/discount.svelte';
	import Slider from '$lib/compontents/checkout/slider.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<div class="mx-auto mt-4 flex w-full flex-col gap-2 px-8">
	<Slider />
	<p class="small">If you would like to contribute more or less slide to your ideal price.</p>
</div>

<!-- <div class="m-4">
	<UserForm />
</div> -->
<!-- <button
		onclick={onSubmitUserForm}
		class="block w-full bg-[var(--color-1)] p-3 text-center text-base font-bold text-[var(--secondary-color)]
       transition-colors duration-200 hover:bg-[var(--color-2)]"
	>
		CONTINUE
	</button> -->
<a href="/checkout/info" class="btn-bauhaus mx-auto mt-12 mb-4 block w-[175px] text-center text-xl">
	CONTINUE
</a>

<style lang="postcss">
	@reference "tailwindcss/theme";
	p.small {
		@apply text-sm lowercase;
	}
</style>
