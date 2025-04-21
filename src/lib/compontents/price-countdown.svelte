<!-- PriceCountdown.svelte -->
<script>
	import pricing from '$lib/stores/pricing.svelte';
	
	export let currentPrice = 0
	// Format price with dollars, cents, and fraction of cent
	/** @param {number} priceInCents @param {number} fraction */
	function formatPriceWithFraction(priceInCents, fraction) {
		const dollars = Math.floor(priceInCents / 100);
		const cents = priceInCents % 100;
		return `${dollars}.${cents.toString().padStart(2, '0')}${fraction.toString().padStart(2, '0')}`;
	}
	
	// Format price in dollars and cents
	/** @param {number} priceInCents */
	function formatPrice(priceInCents) {
		const dollars = Math.floor(priceInCents / 100);
		const cents = priceInCents % 100;
		return `${dollars}.${cents.toString().padStart(2, '0')}`;
	}
	
	// Calculate time remaining in a more readable format (if needed)
	$: timeDisplay = pricing.state.timeRemaining < 60 
		? `${pricing.state.timeRemaining} seconds` 
		: `${Math.floor(pricing.state.timeRemaining / 60)}m ${pricing.state.timeRemaining % 60}s`;
	
	// Determine if we're showing the running state
	$: showCountdown = pricing.state.isRunning || pricing.state.increase < pricing.config.totalIncrease;
</script>

{#if showCountdown}
	<!-- Only show if running or not yet finished -->
	<div class="flex flex-col items-center rounded-md">
		<!-- Timer -->
		<div class="my-0 flex justify-center text-center text-xs md:text-base">
			<div class="countdown flex items-center">
				{#if pricing.state.increase < pricing.config.totalIncrease}
					<div class="">Price increasing in</div>
					<div class="font-bold">{pricing.state.timeRemaining}</div>
					<div class="">seconds</div>
				{:else}
					<div class="font-bold uppercase">Price increase complete!</div>
				{/if}
			</div>
		</div>
		
		<!-- Current price including increase and fraction -->
		<!-- <div class="mt-2 text-sm font-bold uppercase">
			Current increase: ${formatPrice(pricing.state.increase)} 
			<span class="text-xs opacity-75">(+{pricing.state.fractionOfCent}% of next cent)</span>
		</div> -->
		
		<!-- Added: Display next cent amount -->
		<div class="mt-1 text-xs md:text-base">
			<span class="font-semibold">Next ticket price:</span> ${formatPrice(pricing.state.nextPrice + currentPrice)} <a class="text-blue-500 underline" href="/pricing">(Learn more)</a>
		</div>
		
		<!-- Display remaining increase -->
		<!-- <div class="mt-1 text-xs text-gray-600">
			Price will increase by ${formatPrice(pricing.state.finalIncreaseAmount)} by {pricing.config.endDate.toLocaleDateString()}
		</div> -->
		
		<!-- Added: Progress indicator -->
		<!-- <div class="mt-2 w-full max-w-xs">
			<div class="h-1 w-full rounded bg-gray-200">
				<div class="h-1 rounded bg-[var(--primary-color)]" style="width: {pricing.state.progressPercentage}%"></div>
			</div>
			<div class="mt-1 text-center text-xs text-gray-500">
				{pricing.state.progressPercentage}% complete
			</div>
		</div> -->
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	.countdown {
		@apply flex gap-2 rounded-md px-3 py-2 text-center;
	}
</style>