<script>
	import cart from '$lib/stores/cart.svelte';
	import pricing from '$lib/stores/pricing.svelte';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';

	let {
		min = 500,
		max = 10000,
		step = 500,
		value = 1500,
		label = 'Price',
		showValue = true,
		disabled = false,
		color = 'var(--color-2)',
		labelFor = 'ticket-price'
	} = $props();

	let hasSlid = $state(false);

	// Create a spring animation for smooth value changes
	const spring = new Spring(value, {
		stiffness: 0.2,
		damping: 0.4
	});

	spring.target = value;

	// Update the spring value when the prop changes
	// $: displayValue.set(value);
	$effect(() => {
		// Might need to change this if the base value isn't the minimum
		// if (hasSlid) {
		// 	spring.target = value + pricing.state.increase;
		// 	cart.updateTicketPrice(value);
		// }
	});

	onMount(() => {
		// jank
		setTimeout(() => {
			spring.target = value + pricing.state.increase;
			cart.updateTicketPrice(value);
		}, 1000);
	});

	/** @param {*} event */
	function handleInput(event) {
		value = Number(event.target.value);
		cart.updateTicketPrice(value);
		spring.target = value + pricing.state.increase;
		hasSlid = true;
	}

	function getBackgroundSize() {
		return {
			backgroundSize: `${((value - min) * 100) / (max - min)}% 100%`
		};
	}
</script>

<h2 class="font-semibold">Sliding Scale Ticket Price</h2>
<div class="slider-container" class:disabled>
	{#if label}
		<label for={labelFor} class="slider-label">
			{label}
			<!-- <span class="text-black">Sliding Scale Ticket</span> -->
			{#if showValue}
				<span class="value-display">
					${(Math.round(spring.current) / 100).toFixed(2)}
				</span>
			{/if}
		</label>
	{/if}
	<input
		type="range"
		{min}
		{max}
		{step}
		{value}
		{disabled}
		oninput={handleInput}
		style:--slider-color={color}
	/>
</div>

<style>
	.slider-container {
		width: 100%;
		padding: 0.5rem 0;
	}

	.slider-container.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.slider-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-2);
	}

	.value-display {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		color: var(--color-2);
	}

	input[type='range'] {
		width: 100%;
		height: 6px;
		-webkit-appearance: none;
		appearance: none;
		background: #e5e7eb;
		border-radius: 6px;
		background-image: linear-gradient(var(--slider-color), var(--slider-color));
		background-repeat: no-repeat;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-2);
		background: white;
		border: 2px solid var(--slider-color);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--secondary-color);
		border: 2px solid var(--slider-color);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}

	input[type='range']:focus {
		outline: none;
	}

	input[type='range']:focus::-webkit-slider-thumb {
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
	}

	input[type='range']:focus::-moz-range-thumb {
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
	}

	input[type='range']:disabled {
		cursor: not-allowed;
	}
</style>
