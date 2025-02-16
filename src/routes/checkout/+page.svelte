<script>
	import Discount from '$lib/compontents/checkout/discount.svelte';
	import Slider from '$lib/compontents/checkout/slider.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<div class="mx-auto w-9/12">
	<div>Slide to select your price</div>
	<Slider />
</div>
<div class="mt-8 mb-12 flex flex-col justify-center px-5">
	<Discount />
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
<a href="/checkout/info" class="btn-bauhaus block text-center text-2xl w-9/12 mx-auto"> CONTINUE </a>
