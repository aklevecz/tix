<!-- PriceVisualization.svelte -->
<script>
	import { onMount } from 'svelte';
	import pricing from '$lib/stores/pricing.svelte'; // Update this path to your actual store

	/**
	 * Number of data points to plot on the price acceleration chart
	 * @type {number}
	 */
	const dataPointCount = 100;

	/**
	 * Width of the chart in pixels
	 * @type {number}
	 */
	const chartWidth = 800;

	/**
	 * Height of the chart in pixels
	 * @type {number}
	 */
	const chartHeight = 400;

	const padding = { top: 20, right: 40, bottom: 40, left: 60 };

	/**
	 * Currently selected acceleration type for price changes
	 * @type {string}
	 */
	let selectedAccelerationType = pricing.config.accelerationType;

	/**
	 * Exponent value for the POWER acceleration function
	 * @type {number}
	 */
	let powerExponent = 2.5;

	/**
	 * Collection of acceleration functions that determine how price increases over time
	 * Each function takes a time progress value (0-1) and returns a price progress value (0-1)
	 * @type {Object.<string, function>}
	 */
	const accelerationFunctions = {
		/**
		 * @param {number} t - Time progress (0-1)
		 * @returns {number} Price progress (0-1)
		 */
		LINEAR: (t) => t,

		/**
		 * @param {number} t - Time progress (0-1)
		 * @returns {number} Price progress (0-1)
		 */
		QUADRATIC: (t) => t * t,

		/**
		 * @param {number} t - Time progress (0-1)
		 * @returns {number} Price progress (0-1)
		 */
		CUBIC: (t) => t * t * t,

		/**
		 * @param {number} t - Time progress (0-1)
		 * @returns {number} Price progress (0-1)
		 */
		EXPONENTIAL: (t) => (Math.exp(t * 3) - 1) / (Math.exp(3) - 1),

		/**
		 * @param {number} t - Time progress (0-1)
		 * @returns {number} Price progress (0-1)
		 */
		SIGMOID: (t) => 1 / (1 + Math.exp(-12 * (t - 0.5))),

		/**
		 * @param {number} t - Time progress (0-1)
		 * @returns {number} Price progress (0-1)
		 */
		POWER: (t) => Math.pow(t, powerExponent)
	};

	/**
	 * Data points for visualizing the selected acceleration type on the chart
	 * @type {Array.<*>}
	 */
	let visualizationData = [];

	/**
	 * Comparative data across all acceleration types for the table display
	 * @type {Array.<*>}
	 */
	let compareData = [];

	/**
	 * Converts a price in cents to a formatted dollar string
	 * @param {number} cents - Price amount in cents
	 * @returns {string} Formatted price in dollars with 2 decimal places
	 */
	const centsToDollars = (cents) => (cents / 100).toFixed(2);

	/**
	 * Formats a date object for display in the UI
	 * @param {Date} date - Date object to format
	 * @returns {string} Formatted date string (e.g., "Apr 21, 12:30 PM")
	 */
	const formatDate = (date) => {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	/**
	 * Generates visualization data points for the chart and comparison table
	 * Uses the currently selected acceleration type and pricing configuration
	 */
	function generateData() {
		const startDate = pricing.config.startDate;
		const endDate = pricing.config.endDate;
		const totalIncrease = pricing.config.totalIncrease;
		const totalDuration = endDate.getTime() - startDate.getTime();

		visualizationData = [];
		compareData = [];

		// Generate points for the currently selected acceleration type
		for (let i = 0; i <= dataPointCount; i++) {
			const timeProgress = i / dataPointCount;
			const timestamp = new Date(startDate.getTime() + timeProgress * totalDuration);

			// Calculate price increase based on selected acceleration type
			const acceleratedProgress = accelerationFunctions[selectedAccelerationType](timeProgress);
			const priceIncrease = acceleratedProgress * totalIncrease;

			visualizationData.push({
				timeProgress: timeProgress * 100, // Convert to percentage
				priceIncrease,
				formattedPrice: `$${centsToDollars(priceIncrease)}`,
				timestamp: formatDate(timestamp)
			});
		}

		// Generate comparative data for all acceleration types
		for (let i = 0; i <= 10; i++) {
			// Use fewer points for the table
			const timeProgress = i / 10;
			/** @type {Record<string, string | number>}*/
			const rowData = {
				timeProgress: timeProgress * 100, // As percentage
				timestamp: formatDate(new Date(startDate.getTime() + timeProgress * totalDuration))
			};

			// Calculate for each acceleration type
			Object.keys(accelerationFunctions).forEach((type) => {
				const progress = accelerationFunctions[type](timeProgress);
				const increase = progress * totalIncrease;
				rowData[type] = `$${centsToDollars(increase)}`;
			});

			compareData.push(rowData);
		}
	}

	/**
	 * Applies the selected acceleration type to the pricing store
	 * and regenerates the visualization data
	 */
	function applyAccelerationType() {
		pricing.setAccelerationType(selectedAccelerationType);
		generateData();
	}

	// Set up visualization on component mount
	onMount(() => {
		generateData();
	});

	/**
	 * Scales a time progress value (0-100%) to its X coordinate on the SVG chart
	 * @param {number} value - Time progress percentage (0-100)
	 * @returns {number} X coordinate on the SVG chart
	 */
	const xScale = (value) => {
		const innerWidth = chartWidth - padding.left - padding.right;
		return padding.left + (value / 100) * innerWidth;
	};

	/**
	 * Scales a price value to its Y coordinate on the SVG chart
	 * @param {number} value - Price amount in cents
	 * @returns {number} Y coordinate on the SVG chart (inverted for SVG)
	 */
	const yScale = (value) => {
		const innerHeight = chartHeight - padding.top - padding.bottom;
		return chartHeight - padding.bottom - (value / pricing.config.totalIncrease) * innerHeight;
	};

	// Update chart when acceleration type changes
	$: {
		selectedAccelerationType;
		if (typeof document !== 'undefined') {
			generateData();
		}
	}
</script>

<div class="visualization-container">
	<h2>Price Acceleration Visualization</h2>

	<div class="controls">
		<label>
			Acceleration Type:
			<select bind:value={selectedAccelerationType} on:change={applyAccelerationType}>
				<option value="LINEAR">Linear (Constant Rate)</option>
				<option value="QUADRATIC">Quadratic (t²)</option>
				<option value="CUBIC">Cubic (t³)</option>
				<option value="EXPONENTIAL">Exponential</option>
				<option value="SIGMOID">Sigmoid (S-curve)</option>
				<option value="POWER">Power Function</option>
			</select>
		</label>

		{#if selectedAccelerationType === 'POWER'}
			<label>
				Power Exponent:
				<input
					type="number"
					bind:value={powerExponent}
					min="0.1"
					max="10"
					step="0.1"
					on:change={generateData}
				/>
			</label>
		{/if}
	</div>

	<!-- SVG Chart -->
	<div class="chart-container">
		<svg width={chartWidth} height={chartHeight}>
			<!-- X and Y axes -->
			<line
				x1={padding.left}
				y1={chartHeight - padding.bottom}
				x2={chartWidth - padding.right}
				y2={chartHeight - padding.bottom}
				stroke="black"
			/>
			<line
				x1={padding.left}
				y1={padding.top}
				x2={padding.left}
				y2={chartHeight - padding.bottom}
				stroke="black"
			/>

			<!-- X-axis labels -->
			{#each [0, 25, 50, 75, 100] as mark}
				<text x={xScale(mark)} y={chartHeight - padding.bottom + 20} text-anchor="middle">
					{mark}%
				</text>
			{/each}
			<text x={chartWidth / 2} y={chartHeight - 5} text-anchor="middle"> Time Progress </text>

			<!-- Y-axis labels -->
			{#each [0, 25, 50, 75, 100] as percent}
				<text
					x={padding.left - 10}
					y={yScale((percent / 100) * pricing.config.totalIncrease)}
					text-anchor="end"
					dominant-baseline="middle"
				>
					${centsToDollars((percent / 100) * pricing.config.totalIncrease)}
				</text>
			{/each}
			<text
				x={10}
				y={chartHeight / 2}
				text-anchor="middle"
				transform="rotate(-90, 10, {chartHeight / 2})"
			>
				Price Increase
			</text>

			<!-- Line for the chart -->
			<path
				d={visualizationData
					.map(
						(p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.timeProgress)} ${yScale(p.priceIncrease)}`
					)
					.join(' ')}
				fill="none"
				stroke="steelblue"
				stroke-width="2"
			/>

			<!-- Dot for current real-time position (if between start and end dates) -->
			{#if pricing.state.isRunning}
				<circle
					cx={xScale(pricing.state.progressPercentage)}
					cy={yScale(pricing.state.increase + pricing.state.fractionOfCent / 100)}
					r="5"
					fill="red"
				/>
			{/if}
		</svg>
	</div>

	<!-- Comparative data table -->
	<div class="comparison-table">
		<h3>Price Comparison Across Acceleration Types</h3>
		<table>
			<thead>
				<tr>
					<th>Time %</th>
					<th>Date/Time</th>
					<th>Linear</th>
					<th>Quadratic</th>
					<th>Cubic</th>
					<th>Exponential</th>
					<th>Sigmoid</th>
					<th>Power ({powerExponent})</th>
				</tr>
			</thead>
			<tbody>
				{#each compareData as row}
					<tr class={row.timeProgress === 50 ? 'highlight' : ''}>
						<td>{row.timeProgress}%</td>
						<td>{row.timestamp}</td>
						<td>{row.LINEAR}</td>
						<td>{row.QUADRATIC}</td>
						<td>{row.CUBIC}</td>
						<td>{row.EXPONENTIAL}</td>
						<td>{row.SIGMOID}</td>
						<td>{row.POWER}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Current state info -->
	<div class="current-state">
		<h3>Current Price State</h3>
		<p>
			Current Increase: <strong
				>${centsToDollars(pricing.state.increase + pricing.state.fractionOfCent / 100)}</strong
			>
			(${centsToDollars(pricing.state.increase)}{pricing.state.fractionOfCent
				.toString()
				.padStart(2, '0')})
		</p>
		<p>Final Increase Amount: ${centsToDollars(pricing.config.totalIncrease)}</p>
		<p>Time Remaining Until Next Cent: {pricing.state.timeRemaining} seconds</p>
		<p>Progress: {pricing.state.progressPercentage}%</p>
		<button on:click={pricing.startUpdates} disabled={pricing.state.isRunning}>
			Start Updates
		</button>
		<button on:click={pricing.stopUpdates} disabled={!pricing.state.isRunning}>
			Stop Updates
		</button>
	</div>
</div>

<style>
	.visualization-container {
		font-family: Arial, sans-serif;
		max-width: 900px;
		margin: 0 auto;
		padding: 20px;
	}

	.controls {
		margin-bottom: 20px;
		display: flex;
		gap: 20px;
		align-items: center;
	}

	.chart-container {
		margin-bottom: 30px;
		border: 1px solid #ccc;
		padding: 10px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 30px;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: right;
	}

	th {
		background-color: #f2f2f2;
	}

	.highlight {
		background-color: #fff9c4;
	}

	.current-state {
		background-color: #f5f5f5;
		padding: 15px;
		border-radius: 5px;
	}

	button {
		margin-right: 10px;
		padding: 8px 16px;
		cursor: pointer;
		color: white;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
