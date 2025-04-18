<script>
	let { link } = $props();
	let copySuccess = $state(false);
	/** @param {string} link */
	function copyLinkToClipboard(link) {
		navigator.clipboard.writeText(link).then(() => {
			copySuccess = true;
			setTimeout(() => {
				copySuccess = false;
			}, 2000);
		});
	}
</script>

<div class="w-20">
	<div class="text-center text-[var(--secondary-color)]">copy link</div>
	<button class="copy-btn mt-2 " onclick={() => copyLinkToClipboard(link)}>
		{#if copySuccess}
			<span class="text-[var(--primary-color)]">✓</span>
		{:else}
			<img class="mx-auto h-10 w-10 invert" src="/icons/copy.svg" alt="Copy" />
		{/if}
	</button>
</div>
