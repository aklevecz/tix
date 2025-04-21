import { onMount } from 'svelte';

// --- Configuration ---
const startDate = new Date(2025, 3, 20); // April 20, 2025
const endDate = new Date(2025, 4, 2); // May 2, 2025
const totalIncrease = 500; // Total price increase in cents (50.00)
const updateIntervalMs = 100; // Update state every 100ms for accuracy

// Configure the acceleration type and parameters
let accelerationType = 'QUADRATIC'; // Options: 'LINEAR', 'QUADRATIC', 'CUBIC', 'EXPONENTIAL', 'SIGMOID'
const powerExponent = 2.5; // Only used if accelerationType is 'POWER'

/**
 * Calculates price progress with various acceleration functions
 * @param {number} timeProgress - Time progress as a value between 0 and 1
 * @returns {number} - Price progress as a value between 0 and 1
 */
function calculateAcceleratedProgress(timeProgress) {
	// Normalize time to range 0-1
	const t = Math.min(1, Math.max(0, timeProgress));

	switch (accelerationType) {
		case 'LINEAR':
			// Original linear implementation
			return t;

		case 'QUADRATIC':
			// Quadratic growth (t²) - gentle acceleration
			return t * t;

		case 'CUBIC':
			// Cubic growth (t³) - stronger acceleration
			return t * t * t;

		case 'EXPONENTIAL':
			// Exponential growth - rapid acceleration toward the end
			return (Math.exp(t * 3) - 1) / (Math.exp(3) - 1);

		case 'POWER':
			// Power function with configurable exponent
			return Math.pow(t, powerExponent);

		case 'SIGMOID':
			// S-curve - slow start, fast middle, slow end
			return 1 / (1 + Math.exp(-12 * (t - 0.5)));

		default:
			return t; // Fallback to linear
	}
}

function createPricingStore() {
	const state = $state({
		increase: 0, // Current increase in cents
		fractionOfCent: 0, // Fraction of cent (0-99)
		finalIncreaseAmount: totalIncrease, // How much the price will increase by the end
		timeRemaining: 0, // Seconds until next 1¢ increase
		nextPrice: 0, // The next price value when increase changes
		isRunning: false,
		progressPercentage: 0 // Visual indicator of progress (0-100)
	});

	/** @type {ReturnType<typeof setInterval> | undefined} */
	let timer;

	function updateState() {
		// Add 5000 seconds to test future states
		// const now = new Date(new Date().getTime() + 5000 * 1000);
		const now = new Date();

		// Before start date
		if (now < startDate) {
			state.increase = 0;
			state.fractionOfCent = 0;
			state.finalIncreaseAmount = totalIncrease;
			state.progressPercentage = 0;
			state.timeRemaining = Math.ceil((startDate.getTime() - now.getTime()) / 1000);
			state.nextPrice = 1; // First increase will be 1 cent
			return;
		}

		// After end date
		if (now >= endDate) {
			state.increase = totalIncrease;
			state.fractionOfCent = 0;
			state.finalIncreaseAmount = 0;
			state.timeRemaining = 0;
			state.progressPercentage = 100;
			state.nextPrice = totalIncrease; // No more increases, next price is final price
			stopUpdates(); // Stop the timer if the end date is reached
			return;
		}

		// During the increase period
		const totalDuration = endDate.getTime() - startDate.getTime();
		const elapsedTime = now.getTime() - startDate.getTime();

		// Calculate time progress (0-1)
		const timeProgress = elapsedTime / totalDuration;

		// Apply acceleration function to get price progress
		const acceleratedProgress = calculateAcceleratedProgress(timeProgress);

		// Calculate the exact price increase based on accelerated progress
		const exactIncrease = acceleratedProgress * totalIncrease;

		// Update basic state values
		state.increase = Math.floor(exactIncrease);
		state.fractionOfCent = Math.floor((exactIncrease - state.increase) * 100);
		state.finalIncreaseAmount = totalIncrease - state.increase;
		state.progressPercentage = Math.floor(acceleratedProgress * 100);

		// Calculate time until next price change and next price value
		calculateTimeUntilNextPriceChange(timeProgress, totalDuration, now);
	}

	/**
	 * Calculates time until the price increases by the next cent
	 * @param {number} currentTimeProgress - Current progress through total duration (0-1)
	 * @param {number} totalDuration - Total duration in milliseconds
	 * @param {Date} currentTime - The current time (possibly with offset for testing)
	 */
	function calculateTimeUntilNextPriceChange(currentTimeProgress, totalDuration, currentTime) {
		// Get current exact increase based on accelerated progress
		const currentAcceleratedProgress = calculateAcceleratedProgress(currentTimeProgress);
		const currentExactIncrease = currentAcceleratedProgress * totalIncrease;

		// Target is the next cent
		const targetIncrease = Math.floor(currentExactIncrease) + 1;

		// Calculate the next price (current price + 1 cent)
		// Make sure we don't exceed the maximum
		state.nextPrice = Math.min(targetIncrease, totalIncrease);

		// If we've already reached the maximum increase, no more changes
		if (targetIncrease > totalIncrease) {
			state.timeRemaining = 0;
			return;
		}

		// Binary search to find target time progress
		let low = currentTimeProgress;
		let high = 1.0;
		let mid, midValue;
		const MAX_ITERATIONS = 20;
		let iterations = 0;

		while (high - low > 0.0000001 && iterations < MAX_ITERATIONS) {
			mid = (low + high) / 2;
			midValue = calculateAcceleratedProgress(mid) * totalIncrease;

			if (midValue < targetIncrease) {
				low = mid;
			} else {
				high = mid;
			}

			iterations++;
		}

		// Use the midpoint as our target time progress
		const targetTimeProgress = (low + high) / 2;

		// Calculate the timestamp when this progress will be reached
		const targetTimestamp = startDate.getTime() + targetTimeProgress * totalDuration;

		// Use the same time object that was passed to this function
		const nowTimestamp = currentTime.getTime();

		// Calculate seconds until that timestamp
		const timeRemaining = Math.max(0, Math.ceil((targetTimestamp - nowTimestamp) / 1000));

		state.timeRemaining = timeRemaining;
	}

	function startUpdates() {
		if (state.isRunning) return;
		console.log('Starting pricing updates...');
		updateState(); // Initial calculation
		timer = setInterval(updateState, updateIntervalMs);
		state.isRunning = true;
	}

	function stopUpdates() {
		if (!state.isRunning) return;
		console.log('Stopping pricing updates...');
		clearInterval(timer);
		timer = undefined;
		state.isRunning = false;
	}

	return {
		get state() {
			return state;
		},
		startUpdates,
		stopUpdates,
		// Expose constants and configuration
		get config() {
			return {
				startDate,
				endDate,
				totalIncrease,
				accelerationType
			};
		},
		/** @param {'LINEAR' | 'QUADRATIC' | 'CUBIC' | 'EXPONENTIAL' | 'SIGMOID' | 'POWER'} type */
		setAccelerationType(type) {
			if (['LINEAR', 'QUADRATIC', 'CUBIC', 'EXPONENTIAL', 'SIGMOID', 'POWER'].includes(type)) {
				accelerationType = type;
				updateState(); // Recalculate with new function
			}
		}
	};
}

const pricing = createPricingStore();

export default pricing;
