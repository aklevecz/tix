<script>
	import { page } from '$app/state';
	import user from '$lib/stores/user.svelte';
</script>

<header class="flex items-center gap-4 p-2 font-bold">
	<a href="/"><h1 class="text-2xl">Tix</h1></a>
	<nav class="flex items-center gap-4 w-full">
		<!-- <a class:active={page.url.pathname === '/'} href="/">Home</a> -->
		<!-- <a class:active={page.url.pathname === '/checkout'} href="/checkout">Checkout</a> -->
		<a class:active={page.url.pathname === '/freebee'} href="/freebee">Freebee</a>
		<a class:active={page.url.pathname === '/profile'} href="/profile">profile</a>
		<a class:active={page.url.pathname === '/generate'} href="/generate">generate</a>
		<!-- <div class="flex-[1_0_auto]"></div> -->
		{#if user.token}
			<button onclick={user.logout} class="btn-bauhaus self-end">Logout</button>
		{/if}
	</nav>
</header>

<style lang="postcss">
	@reference "tailwindcss/theme";
	a {
		@apply text-xs;
	}
	.active {
		@apply text-[var(--color-2)] transition-colors duration-200;
	}
	input {
		@apply ml-3 w-1/2 border border-[var(--secondary-color)] bg-transparent p-2 text-[var(--secondary-color)] focus:border-[var(--color-1)] focus:outline-none;
	}
	button {
		@apply text-xs;
	}
</style>
