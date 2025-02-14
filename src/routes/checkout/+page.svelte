<script>
	import Discount from '$lib/compontents/checkout/discount.svelte';
	import UserForm from '$lib/compontents/checkout/user-form.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<div class="flex flex-col justify-center px-5 mt-2 mb-8">
	<h3>Discount code</h3>
	<Discount />
</div>
<div class="m-4">
	<UserForm />
</div>
<div class="bg-[#121212] p-8">
	<!-- <button
		onclick={onSubmitUserForm}
		class="block w-full bg-[var(--red)] p-3 text-center text-base font-bold text-white
       transition-colors duration-200 hover:bg-[var(--yellow)]"
	>
		CONTINUE
	</button> -->
	<a
		href="/checkout/pay"
		class="btn-bauhaus block text-center text-2xl"
	>
		CONTINUE
	</a>
</div>
