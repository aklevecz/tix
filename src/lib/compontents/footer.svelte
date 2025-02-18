<script>
	import { browser } from "$app/environment";
	import { afterNavigate } from "$app/navigation";
	let windowHeight = $state(0);

	afterNavigate(() => {
		if (browser) {
			const windowHeight = window.innerHeight;
            const bodyHeight = document.body.getBoundingClientRect().height
			// document.body.style.height = `${Math.max(windowHeight, bodyHeight)}px`;
		}
	});
</script>

<footer>
	<h1 class="text-2xl font-bold" style="top:{windowHeight}px;">Tix</h1>
</footer>

<style lang="postcss">
	@reference "tailwindcss/theme";

	footer {
		@apply mt-10 w-full bg-[var(--secondary-color)] p-2 text-[var(--primary-color)];
	}
</style>
