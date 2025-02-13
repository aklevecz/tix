<script>
	import { formatPrice } from '$lib/utils';
	import { onMount } from 'svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let { order } = data;

	/** @type {PaymentIntent | null} */
	let receipt = $state(null);

	onMount(async () => {
		const res = await fetch(`/api/checkout?paymentIntentId=${data.paymentIntentId}`);

		/** @type {{ paymentIntent: PaymentIntent }} */
		const { paymentIntent } = await res.json();

		receipt = paymentIntent;
	});
</script>
{#if order}
	<div class="receipt-container mx-auto max-w-lg rounded-md bg-black p-4 pt-0 shadow-lg min-h-[83.2vh]">
		<h1 class="mb-4 text-3xl font-bold tracking-wide text-white uppercase">Receipt</h1>

		<div class="info mb-3">
			<p class="text-lg font-bold tracking-wider text-white uppercase">Name</p>
			<p class="text-white">{order?.name}</p>
		</div>
		<div class="info mb-3">
			<p class="text-lg font-bold tracking-wider text-white uppercase">Email</p>
			<p class="text-white">{order?.email}</p>
		</div>
		<div class="info mb-3">
			<p class="text-lg font-bold tracking-wider text-white uppercase">Phone</p>
			<p class="text-white">{order?.phone}</p>
		</div>

		<div class="items mb-4">
			<h2 class="mb-2 text-xl font-bold tracking-wide text-[var(--red)] uppercase">Items</h2>
			{#each Object.entries(JSON.parse(order.items)) as [key, object]}
				<div class="item flex justify-between border-b border-gray-700 py-1">
					<!-- {JSON.stringify(object)} -->
					<div class="item-title text-white">{object.item.title}</div>
					<div>{formatPrice(object.item.price)}</div>
					<div class="item-quantity text-white">{object.quantity}</div>
				</div>
			{/each}
		</div>

		<div class="total space-y-2">
			<div class="total-line">
				<span class="w-32 uppercase">Subtotal</span>
				<span class="text-right text-[var(--red)]">{formatPrice(order?.subtotal || 0)}</span>
			</div>
			<div class="total-line">
				<span class="w-32 uppercase">Discount</span>
				<span class="text-right text-[var(--red)]">{order?.discount || 0}%</span>
			</div>
			<div class="total-line">
				<span class="w-32 uppercase">Total</span>
				<span class="text-right text-[var(--red)]">{formatPrice(receipt?.amount || 0)}</span>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	.total-line {
		@apply ml-auto flex w-[70%] items-center justify-between text-xl font-bold text-white;
	}
</style>
