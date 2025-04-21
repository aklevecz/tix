import { onMount } from 'svelte'; // Import onMount if needed for initialization logic within the store itself, though typically managed by component lifecycle

// --- Configuration ---
const startDate = new Date(2025, 3, 20); // April 20, 2025
const endDate = new Date(2025, 4, 2); // May 2, 2025
const totalIncrease = 500; // Total price increase in cents (50.00)
const updateIntervalMs = 100; // Update state every 100ms for accuracy

function createPricingStore() {
	const state = $state({
		increase: 0, // Current increase in cents
		fractionOfCent: 0, // Fraction of cent (0-99)
		nextCentChangeTime: new Date(), // Time until next cent change
		finalIncreaseAmount: totalIncrease, // How much the price will increase by the end
		timeRemaining: 0, // Seconds until next 1¢ increase
		isRunning: false
	});

	/** @type {ReturnType<typeof setInterval> | undefined} */
	let timer;

	// Calculate the time until the next cent changes
	/** @param {number} exactIncrease */
	function calculateNextCentChangeTime(exactIncrease) {
		const currentFullCents = Math.floor(exactIncrease);
		const nextFullCent = currentFullCents + 1;

		// Prevent division by zero or calculation if increase is already met
		if (nextFullCent > totalIncrease) {
			state.nextCentChangeTime = endDate; // Or some indicator it's over
			return;
		}

		const totalDuration = endDate.getTime() - startDate.getTime();
		if (totalDuration <= 0) {
			state.nextCentChangeTime = endDate;
			return;
		}

		const nextCentPercentage = nextFullCent / totalIncrease;
		const timeToNextCent = nextCentPercentage * totalDuration;
		const millisecondsFromStart = timeToNextCent;

		state.nextCentChangeTime = new Date(startDate.getTime() + millisecondsFromStart);
	}

	// Calculate the current real-time price increase and related values
	function updateState() {
		const now = new Date();

		// Before start date
		if (now < startDate) {
			state.increase = 0;
			state.fractionOfCent = 0;
			state.finalIncreaseAmount = totalIncrease;
			calculateNextCentChangeTime(0); // Calculate time to first cent change
            state.timeRemaining = Math.ceil((state.nextCentChangeTime.getTime() - now.getTime()) / 1000);
			return;
		}

		// After end date
		if (now >= endDate) {
			state.increase = totalIncrease;
			state.fractionOfCent = 0;
			state.finalIncreaseAmount = 0;
			state.timeRemaining = 0;
            state.nextCentChangeTime = endDate; // Ensure it's set to end
			stopUpdates(); // Stop the timer if the end date is reached
			return;
		}

		// During the increase period
		const totalDuration = endDate.getTime() - startDate.getTime();
		const elapsedTime = now.getTime() - startDate.getTime();
		const timeProgress = elapsedTime / totalDuration;

		const exactIncrease = timeProgress * totalIncrease;
		state.increase = Math.floor(exactIncrease);
		state.fractionOfCent = Math.floor((exactIncrease - state.increase) * 100);
		state.finalIncreaseAmount = totalIncrease - state.increase;

		calculateNextCentChangeTime(exactIncrease);

		const timeToNextCentChange = Math.max(0, state.nextCentChangeTime.getTime() - now.getTime());
		state.timeRemaining = Math.ceil(timeToNextCentChange / 1000);
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

	// Initialize state immediately when store is created
    // updateState(); // Calculate initial state without waiting for component mount

	return {
		get state() {
			return state;
		},
		startUpdates,
		stopUpdates,
        // Expose constants if needed by components, though maybe not necessary now
        // get config() {
        //  return { startDate, endDate, totalIncrease };
        // }
	};
}

const pricing = createPricingStore();

export default pricing;
