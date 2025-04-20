<!-- PriceCountdown.svelte -->
<script>
	import { formatPrice } from '$lib/utils';
	import { onMount } from 'svelte';
	import pricing from '$lib/stores/pricing.svelte';
	let { currentPrice } = $props();

	// Define our key dates
	const startDate = new Date(2025, 3, 20); // April 20, 2025
	const endDate = new Date(2025, 4, 2); // May 2, 2025

	// Configuration
	const totalIncrease = 500; // Total price increase in cents (50.00)
	const updateInterval = 10; // Price visibly updates every 10 seconds

	// State variables
	let timeRemaining = $state(0); // Only seconds now
	// let currentPriceIncrease = $state(0); // Current increase in cents
	let fractionOfCent = $state(0); // Fraction of cent (0-99)
	let nextCentChangeTime = $state(new Date()); // Time until next cent change
	let finalIncreaseAmount = $state(0); // How much the price will increase by the end
	/** @type {*} */
	let timer;

	// Format price with fraction of cent
	/** @param {number} priceInCents  @param {number} fraction */
	function formatPriceWithFraction(priceInCents, fraction) {
		const dollars = Math.floor(priceInCents / 100);
		const cents = priceInCents % 100;
		return `${dollars}.${cents.toString().padStart(2, '0')}${fraction.toString().padStart(2, '0')}`;
	}

	// Calculate the current real-time price increase and set next cent change time
	function calculateRealTimePriceIncrease() {
		const now = new Date();

		// If before start date
		if (now < startDate) {
			// currentPriceIncrease = 0;
            pricing.setIncrease(0)
			fractionOfCent = 0;
			finalIncreaseAmount = totalIncrease;
			calculateNextCentChangeTime(0);
			return;
		}

		// If after end date
		if (now > endDate) {
			// currentPriceIncrease = totalIncrease;
            pricing.setIncrease(totalIncrease)
			fractionOfCent = 0;
			finalIncreaseAmount = 0;
			return;
		}

		// Calculate the total duration in milliseconds
		const totalDuration = endDate.getTime() - startDate.getTime();

		// Calculate elapsed time in milliseconds
		const elapsedTime = now.getTime() - startDate.getTime();

		// Calculate the percentage of time elapsed (0 to 1)
		const timeProgress = elapsedTime / totalDuration;

		// Calculate current price increase (real-time, to the cent)
		const exactIncrease = timeProgress * totalIncrease;
		// currentPriceIncrease = Math.floor(exactIncrease);
        pricing.setIncrease(Math.floor(exactIncrease))

		// Calculate fraction of cent (0-99)
		// fractionOfCent = Math.floor((exactIncrease - currentPriceIncrease) * 100);
        fractionOfCent = Math.floor((exactIncrease - pricing.state.increase) * 100);

		// Calculate remaining increase
		// finalIncreaseAmount = totalIncrease - currentPriceIncrease;
        finalIncreaseAmount = totalIncrease - pricing.state.increase

		// Set time until next cent changes
		calculateNextCentChangeTime(exactIncrease);
	}

	// Calculate the time until the next cent changes
    /** @param {number} exactIncrease */
	function calculateNextCentChangeTime(exactIncrease) {
		const currentFullCents = Math.floor(exactIncrease);
		const nextFullCent = currentFullCents + 1;

		// Calculate the total duration in milliseconds
		const totalDuration = endDate.getTime() - startDate.getTime();

		// Calculate at what percentage of the total time we reach the next cent
		const nextCentPercentage = nextFullCent / totalIncrease;

		// Calculate when we'll reach that percentage
		const timeToNextCent = nextCentPercentage * totalDuration;
		const millisecondsFromStart = timeToNextCent;

		// Convert to absolute time
		nextCentChangeTime = new Date(startDate.getTime() + millisecondsFromStart);
	}

	// Update countdown timer and price
	function updateCountdownAndPrice() {
		const now = new Date();

		// Calculate price increase in real-time
		calculateRealTimePriceIncrease();

		// Calculate time to next cent change in seconds
		const timeToNextCentChange = Math.max(0, nextCentChangeTime.getTime() - now.getTime());
		timeRemaining = Math.ceil(timeToNextCentChange / 1000); // Round up to next second
	}

	// Initialize
	function initialize() {
		updateCountdownAndPrice();
	}

	// Setup on component mount
	onMount(() => {
		initialize();

		// Update frequently for smoother fraction updates
		timer = setInterval(updateCountdownAndPrice, 100);

		return () => clearInterval(timer);
	});
</script>

<div class="flex flex-col items-center rounded-md">
	<!-- Timer - simplified to just seconds -->
	<div class="my-0 flex justify-center text-center text-xs">
		<div class="countdown flex items-center">
			<div class="uppercase">Price Increasing by <span class="font-bold">1¢</span> in</div>

			<div class="text-[var(--primary-color)] font-bold">{timeRemaining}</div>
			<div class="uppercase">seconds</div>
		</div>
	</div>
	<!-- <div class="mt-2 text-sm font-bold uppercase">
        Current price: {formatPriceWithFraction(currentPrice + pricing.state.increase, fractionOfCent)}
        Current increase: {formatPrice(pricing.state.increase)}
	</div> -->

	<!-- <div class="mt-1 text-xs text-gray-600">
      Price will increase by {formatPrice(finalIncreaseAmount)} by {endDate.toLocaleDateString()}
    </div> -->
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	.countdown {
		@apply  flex gap-2 rounded-md text-[var(--primary-color)] bg-[var(--third-color)] px-3 py-2 text-center ;
	}
</style>
