<script>
	import GenerationStatus from '$lib/compontents/generation/generation-status.svelte';
	import generate from '$lib/stores/generate.svelte';
	import { formatPrice } from '$lib/utils';
	import { onMount } from 'svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let { order } = data;

	/** @type {PaymentIntent | null} */
	let receipt = $state(null);

	onMount(async () => {
		if (data.generate) {
			generate.generateRaptor();
		} else {
			generate.init();
		}
		const res = await fetch(`/api/checkout?paymentIntentId=${data.paymentIntentId}`);

		/** @type {{ paymentIntent: PaymentIntent }} */
		const { paymentIntent } = await res.json();

		receipt = paymentIntent;
	});
</script>

{#if order}
	<div
		class="receipt-container mx-auto max-w-lg rounded-md bg-[var(--primary-color)] p-4 pt-0 shadow-lg"
	>
		{#if generate.state.generating || (!generate.state.cachedImg && !generate.state.lastImgUrl)}
			<GenerationStatus />
		{/if}
		<h1 class="mb-2 text-xl font-bold tracking-wide text-[var(--secondary-color)] uppercase">
			Receipt
		</h1>

		<div class="info mb-3">
			<p class="text-xs font-bold tracking-wider text-[var(--secondary-color)] uppercase">Name</p>
			<p class="text-[var(--secondary-color)]">{order?.name}</p>
		</div>
		<div class="info mb-3">
			<p class="text-xs font-bold tracking-wider text-[var(--secondary-color)] uppercase">email</p>
			<p class="text-[var(--secondary-color)]">{order?.email}</p>
		</div>
		<div class="info mb-3">
			<p class="text-xs font-bold tracking-wider text-[var(--secondary-color)] uppercase">phone</p>
			<p class="text-[var(--secondary-color)]">{order?.phone}</p>
		</div>

		<div class="items mb-4">
			<!-- Header row -->
			<div class="receipt-grid-line mb-0 pb-1">
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
		<div>
			{#if generate.state.lastImgUrl}<img
					src={generate.state.lastImgUrl}
					alt=""
					style="width: 200px; height: 200px; margin:auto; display:block; padding:1rem;"
				/>{/if}
			{#if !generate.state.lastImgUrl && generate.state.cachedImg}<img
					src={JSON.parse(generate.state.cachedImg)}
					alt=""
					style="width: 200px; height: 200px; margin:auto; display:block; padding:1rem;"
				/>{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	.total-line {
		@apply ml-auto flex w-[70%] items-center justify-between text-base font-bold text-[var(--secondary-color)];
	}
	.receipt-grid-line {
		@apply grid grid-cols-[1fr_75px_70px] gap-4 border-b border-gray-700 text-xs font-bold;
	}
</style>
