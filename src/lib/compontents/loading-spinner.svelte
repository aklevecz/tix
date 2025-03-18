<div class="loading-animation">
	<div class="spinner"></div>
	<div class="loading-text">Loading</div>
</div>

<style lang="postcss">
    @reference "tailwindcss/theme";
	.loading-animation {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	/* Spinner design */
	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid transparent;
		border-top-color: #d037ff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	/* Loading text styling */
	.loading-text {
		color: #000000;
		font-size: 1.2rem;
		text-transform: uppercase;
		letter-spacing: 0.1rem;
	}

	/* Keyframes for the spinner animation */
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
