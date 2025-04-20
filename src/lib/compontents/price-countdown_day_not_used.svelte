<!-- PriceCountdown.svelte -->
<script>
	import { formatPrice } from '$lib/utils';
import { onMount } from 'svelte';

	let { currentPrice } = $props();

	// Define our key dates
	const startDate = new Date(2025, 3, 20); // April 20, 2025
	const endDate = new Date(2025, 4, 2); // May 2, 2025

	// State variables
	let nextIncreaseDate = $state(new Date(startDate));
	let nextPrice = $state(1); // Start with next price as 1
	let timeRemaining = $state({ days: 0, hours: 0, minutes: 0, seconds: 0 });
	let currentDate = $state(new Date());
    /** @type {*} */
	let timer;

	// Initialize countdown
	function initializeCountdown() {
		currentDate = new Date();

		// Calculate current value and next increase date
		if (currentDate < startDate) {
			nextIncreaseDate = new Date(startDate);
			nextIncreaseDate.setDate(nextIncreaseDate.getDate() + 4); // First increase on April 24
			nextPrice = 1;
		} else if (currentDate > endDate) {
			nextPrice = 3; // Final value
			return;
		} else {
			const daysElapsed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
			const currentValue = Math.floor(daysElapsed / 4);
			nextPrice = currentValue + 1;

			const daysSinceLastIncrease = daysElapsed % 4;
			const daysUntilNextIncrease = 4 - daysSinceLastIncrease;

			const newNextIncreaseDate = new Date(currentDate);
			newNextIncreaseDate.setDate(currentDate.getDate() + daysUntilNextIncrease);
			nextIncreaseDate = newNextIncreaseDate;

			// Don't show timer if we've hit the end date
			if (nextIncreaseDate > endDate) {
				nextIncreaseDate = endDate;
			}
		}

		updateCountdown();
	}

	// Update countdown timer
	function updateCountdown() {
		const now = new Date();
		const distance = nextIncreaseDate.getTime() - now.getTime();

		// Create a new object for reactivity
		timeRemaining = {
			days: Math.floor(distance / (1000 * 60 * 60 * 24)),
			hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
			seconds: Math.floor((distance % (1000 * 60)) / 1000)
		};
	}

	// Setup on component mount
	onMount(() => {
		initializeCountdown();
		timer = setInterval(updateCountdown, 1000);
		return () => clearInterval(timer);
	});
</script>

<div class="flex flex-col items-center rounded-md">
	<div class="mt-2 text-sm font-bold uppercase">Price will increase to {formatPrice(currentPrice + nextPrice * 100)}</div>
	<!-- Timer -->
	<div class="my-2 flex justify-center space-x-2">
		<div class="countdown">
			<div class="font-mono text-xs font-bold">{timeRemaining.days}</div>
			<div class="text-xs uppercase">days</div>
		</div>
		<div class="countdown">
			<div class="font-mono text-xs font-bold">{timeRemaining.hours}</div>
			<div class="text-xs uppercase">hours</div>
		</div>
		<div class="countdown">
			<div class="font-mono text-xs font-bold">{timeRemaining.minutes}</div>
			<div class="text-xs uppercase">mins</div>
		</div>
		<div class="countdown">
			<div class="font-mono text-xs font-bold">{timeRemaining.seconds}</div>
			<div class="text-xs uppercase">secs</div>
		</div>
	</div>

	<!-- CTA -->
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	.countdown {
		@apply w-16 rounded-md bg-[var(--third-color)] px-3 py-2 text-center text-white;
	}
</style>
