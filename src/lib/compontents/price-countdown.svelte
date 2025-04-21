<!-- PriceCountdown.svelte -->
<script>
	import { formatPrice } from '$lib/utils'; // Keep if needed for other display purposes, or remove if unused
	import { onMount } from 'svelte';
	import pricing from '$lib/stores/pricing.svelte';

	// Base price passed as prop (optional, depending on how you use the component)
	// let { currentPrice = 0 } = $props(); // Example if you need a base price

	// Format price with fraction of cent (kept for potential display needs)
	/** @param {number} priceInCents  @param {number} fraction */
	function formatPriceWithFraction(priceInCents, fraction) {
		const dollars = Math.floor(priceInCents / 100);
		const cents = priceInCents % 100;
		return `${dollars}.${cents.toString().padStart(2, '0')}${fraction.toString().padStart(2, '0')}`;
	}
</script>

{#if pricing.state.isRunning || pricing.state.increase < 500}
	<!-- Only show if running or not yet finished -->
	<div class="flex flex-col items-center rounded-md">
		<!-- Timer -->
		<div class="my-0 flex justify-center text-center text-xs">
			<div class="countdown flex items-center">
				{#if pricing.state.increase < 500}
					<div class="uppercase">Price Increasing by <span class="font-bold">1¢</span> in</div>
					<div class="font-bold text-[var(--primary-color)]">{pricing.state.timeRemaining}</div>
					<div class="uppercase">seconds</div>
				{:else}
					<div class="font-bold uppercase">Price increase complete!</div>
				{/if}
			</div>
		</div>

		<!-- Optional: Display current price including increase and fraction -->
		<!-- <div class="mt-2 text-sm font-bold uppercase">
        Current dynamic price: {formatPriceWithFraction(currentPrice + pricing.state.increase, pricing.state.fractionOfCent)}
	</div> -->

		<!-- Optional: Display remaining increase -->
		<!-- <div class="mt-1 text-xs text-gray-600">
      Price will increase by {formatPrice(pricing.state.finalIncreaseAmount)} by {pricing.config.endDate.toLocaleDateString()}
    </div> -->
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	.countdown {
		@apply flex gap-2 rounded-md bg-[var(--third-color)] px-3 py-2 text-center text-[var(--primary-color)];
	}
</style>
