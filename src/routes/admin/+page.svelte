<script>
	/** @type {import('./$types').PageData} */
	export let data;

	$: ({ orders, freebees, sharebees, error } = data);

	/**
	 * Helper to format date/time strings
	 * @param {string | number | Date | null | undefined} dateTimeString
	 */
	function formatDateTime(dateTimeString) {
		if (!dateTimeString) return 'N/A';
		try {
			return new Date(dateTimeString).toLocaleString();
		} catch (e) {
			return dateTimeString; // Return original if parsing fails
		}
	}

	/**
	 * Helper to safely stringify JSON potentially stored as strings
	 * @param {any} value
	 */
	function safeStringify(value) {
		if (typeof value === 'string') {
			try {
				// Attempt to parse if it looks like JSON, then stringify nicely
				if (
					(value.startsWith('{') && value.endsWith('}')) ||
					(value.startsWith('[') && value.endsWith(']'))
				) {
					return JSON.stringify(JSON.parse(value), null, 2);
				}
			} catch (e) {
				// If parsing fails, return the original string
				return value;
			}
		}
		// If not a string, stringify directly
		return JSON.stringify(value, null, 2);
	}

	/**
	 * Truncates a string to a maximum length.
	 * @param {string} str The string to truncate.
	 * @param {number} maxLength The maximum length.
	 */
	function truncateString(str, maxLength) {
		if (typeof str !== 'string' || str.length <= maxLength) {
			return str;
		}
		return str.substring(0, maxLength) + '...';
	}

	/** @param {*} event */
	async function createSharebee(event) {
		event.preventDefault();
		const formData = new FormData(/** @type {HTMLFormElement} */ (event.target));
		const sharebeeId = formData.get('sharebeeId');
		const projectName = formData.get('projectName');

		try {
			const response = await fetch('/api/sharebee/create/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ sharebeeId, projectName })
			});

			if (response.ok) {
				// Reload the page to show the new sharebee
				window.location.reload();
			} else {
				const error = await response.json();
				alert(error.message || 'Failed to create sharebee');
			}
		} catch (error) {
			console.error('Error creating sharebee:', error);
			alert('Failed to create sharebee');
		}
	}

	/** @param {string} id */
	async function deleteSharebee(id) {
		try {
			const response = await fetch('/api/sharebee/delete/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id })
			});

			if (response.ok) {
				// Reload the page to show the new sharebee
				window.location.reload();
			} else {
				const error = await response.json();
				alert(error.message || 'Failed to delete sharebee');
			}
		} catch (error) {
			console.error('Error deleting sharebee:', error);
			alert('Failed to delete sharebee');
		}
	}

	/** @param {string} pid @param {string} project_name @param {number} quantity */
	async function generateQRCodes(pid, project_name, quantity) {
		try {
			const response = await fetch('/api/admin/generate-qr/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ pid, project_name, quantity })
			});

			if (response.ok) {
				// Reload the page to show the new sharebee
				window.location.reload();
			} else {
				const error = await response.json();
				alert(error.message || 'Failed to generate QR codes');
			}
		} catch (error) {
			console.error('Error generating QR codes:', error);
			alert('Failed to generate QR codes');
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div class="admin-dashboard">
	<h1>Admin Dashboard</h1>

	{#if error}
		<p class="error">Error loading data: {error}</p>
	{/if}

	<!-- Orders Table -->
	<section>
		<h2>Orders (tix_orders)</h2>
		{#if orders && orders.length > 0}
			<table>
				<thead>
					<tr>
						<th>pi_id</th>
						<th>Name</th>
						<th>Phone</th>
						<th>Email</th>
						<th>Status</th>
						<th>Amount</th>
						<th>Subtotal</th>
						<th>Discount</th>
						<th>Project Name</th>
						<th>Origin</th>
						<th>Items</th>
					</tr>
				</thead>
				<tbody>
					{#each orders as order (order.pi_id)}
						<!-- TODO: Make more dynamic -->
						{@const quantityOfFirstItem = Object.values(JSON.parse(order.items))[0].quantity}
						<tr>
							<td>{order.pi_id}</td>
							<td>{order.name || 'N/A'}</td>
							<td>{order.phone || 'N/A'}</td>
							<td>{order.email || 'N/A'}</td>
							<td>{order.status || 'N/A'}</td>
							<td>{order.amount || 'N/A'}</td>
							<td>{order.subtotal || 'N/A'}</td>
							<td>{order.discount || 'N/A'}</td>
							<td>{order.project_name || 'N/A'}</td>
							<td>{order.origin || 'N/A'}</td>
							<td><pre>{truncateString(safeStringify(order.items), 100)}</pre></td>
							<td>{quantityOfFirstItem}</td>
							<td><button onclick={() => generateQRCodes(order.pi_id, order.project_name, quantityOfFirstItem)}>Generate QR</button></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if !error}
			<p>No orders found.</p>
		{/if}
	</section>

	<!-- Freebees Table -->
	<section>
		<h2>Freebees</h2>
		{#if freebees && freebees.length > 0}
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Winner</th>
						<th>Project Name</th>
						<th>Date</th>
						<th>Time</th>
					</tr>
				</thead>
				<tbody>
					{#each freebees as freebee (freebee.id)}
						<tr>
							<td>{freebee.id}</td>
							<td>{freebee.winner || 'N/A'}</td>
							<td>{freebee.project_name || 'N/A'}</td>
							<td>{freebee.date || 'N/A'}</td>
							<td>{freebee.time || 'N/A'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if !error}
			<p>No freebees found.</p>
		{/if}
	</section>

	<!-- Sharebees Table -->
	<section>
		<h2>Sharebees</h2>
		{#if sharebees && sharebees.length > 0}
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Winner</th>
						<th>Project Name</th>
						<th>Created At</th>
						<th>Claimed At</th>
					</tr>
				</thead>
				<tbody>
					{#each sharebees as sharebee (sharebee.id)}
						<tr>
							<td>{sharebee.id}</td>
							<td>{sharebee.winner || 'N/A'}</td>
							<td>{sharebee.project_name || 'N/A'}</td>
							<td>{formatDateTime(/** @type {string} */ (sharebee.created_at))}</td>
							<td
								>{sharebee.claimed_at
									? formatDateTime(/** @type {string} */ (sharebee.claimed_at))
									: 'Not Claimed'}</td
							>
							<td><button onclick={() => deleteSharebee(String(sharebee.id))}>Delete</button></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if !error}
			<p>No sharebees found.</p>
		{/if}
	</section>

	<!-- Create Sharebee Form -->
	<section>
		<h2>Create Sharebee</h2>
		<form onsubmit={createSharebee}>
			<label for="sharebeeId">Sharebee ID:</label>
			<input type="text" id="sharebeeId" name="sharebeeId" required />

			<label for="projectName">Project Name:</label>
			<input type="text" id="projectName" name="projectName" required />

			<button class="btn-bauhaus mt-2" type="submit">Create Sharebee</button>
		</form>
	</section>
</div>

<style>
	.admin-dashboard {
		font-family: sans-serif;
		padding: 20px;
		max-width: 1400px;
		margin: 0 auto;
	}
	h1,
	h2 {
		color: #333;
		border-bottom: 1px solid #eee;
		padding-bottom: 5px;
		margin-top: 30px;
	}
	h1 {
		margin-top: 0;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 15px;
		font-size: 0.9em;
		box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
	}
	th,
	td {
		border: 1px solid #ddd;
		padding: 8px 12px;
		text-align: left;
		vertical-align: top; /* Align content top for pre tags */
	}
	th {
		background-color: #f4f4f4;
		font-weight: bold;
	}
	tbody tr:nth-child(even) {
		background-color: #f9f9f9;
	}
	tbody tr:hover {
		background-color: #f1f1f1;
	}
	pre {
		white-space: pre-wrap; /* Wrap long JSON strings */
		word-wrap: break-word;
		margin: 0;
		font-size: 0.85em;
		background-color: #eee;
		padding: 5px;
		border-radius: 3px;
	}
	.error {
		color: red;
		font-weight: bold;
	}
	section {
		margin-bottom: 40px;
		overflow-x: auto; /* Allow horizontal scrolling for wide tables */
	}
	button {
		color: white;
	}
</style>
