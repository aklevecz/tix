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
	<div
		class="receipt-container mx-auto min-h-[87vh] max-w-lg rounded-md bg-[var(--primary-color)] p-4 pt-0 shadow-lg"
	>
		<h1 class="mb-4 text-3xl font-bold tracking-wide text-[var(--secondary-color)] uppercase">
			Receipt
		</h1>

		<div class="info mb-3">
			<p class="text-lg font-bold tracking-wider text-[var(--secondary-color)] uppercase">Name</p>
			<p class="text-[var(--secondary-color)]">{order?.name}</p>
		</div>
		<div class="info mb-3">
			<p class="text-lg font-bold tracking-wider text-[var(--secondary-color)] uppercase">Email</p>
			<p class="text-[var(--secondary-color)]">{order?.email}</p>
		</div>
		<div class="info mb-3">
			<p class="text-lg font-bold tracking-wider text-[var(--secondary-color)] uppercase">Phone</p>
			<p class="text-[var(--secondary-color)]">{order?.phone}</p>
		</div>

		<div class="items mb-4">
			<!-- Header row -->
			<div class="receipt-grid-line mb-2 pb-1">
				<div>Item</div>
				<div>Price</div>
				<div>Quantity</div>
			</div>

			<!-- List items -->
			{#each Object.entries(JSON.parse(order.items)) as [key, object]}
				<div class="receipt-grid-line py-1">
					<div class="item-title">{object.item.title}</div>
					<div>{formatPrice(object.item.price)}</div>
					<div class="item-quantity">{object.quantity}</div>
				</div>
			{/each}
		</div>

		<div class="total space-y-2">
			<div class="total-line">
				<span class="w-32 uppercase">Subtotal</span>
				<span class="text-right text-[var(--secondary-color)]"
					>{formatPrice(order?.subtotal || 0)}</span
				>
			</div>
			<div class="total-line">
				<span class="w-32 uppercase">Discount</span>
				<span class="text-right text-[var(--color-2)]">{order?.discount || 0}%</span>
			</div>
			<div class="total-line">
				<span class="w-32 uppercase">Total</span>
				<span class="text-right text-[var(--secondary-color)]"
					>{formatPrice(receipt?.amount || 0)}</span
				>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	.total-line {
		@apply ml-auto flex w-[70%] items-center justify-between text-xl font-bold text-[var(--secondary-color)];
	}
	.receipt-grid-line {
		@apply grid grid-cols-[1fr_75px_70px] gap-4 border-b border-gray-700 text-xs font-bold;
	}
</style>
