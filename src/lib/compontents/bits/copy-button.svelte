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

<div>
	<div class="mt-4 text-[var(--third-color)] text-center">copy link</div>
	<button class="copy-btn mt-2" onclick={() => copyLinkToClipboard(link)}>
		{#if copySuccess}
			✓
		{:else}
			<img class="mx-auto h-10 w-10" src="/icons/copy.svg" alt="Copy" />{/if}
	</button>
</div>
