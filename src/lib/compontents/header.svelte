<script>
	import { page } from '$app/state';
</script>

<header class="flex items-center gap-4 p-2 font-bold">
	<h1 class="text-2xl">Tix</h1>
	<nav class="flex gap-4">
		<a class:active={page.url.pathname === '/'} href="/">Home</a>
		<a class:active={page.url.pathname === '/checkout'} href="/checkout">Checkout</a>
	</nav>
</header>


<style lang="postcss">
	@reference "tailwindcss/theme";
	.active {
		@apply text-[var(--red)] transition-colors duration-200;
	}
	input {
		@apply ml-3 w-1/2 border border-white bg-transparent p-2 text-white focus:border-[var(--red)] focus:outline-none;
	}
</style>
