<script>
	import { page } from '$app/state';
	import user from '$lib/stores/user.svelte';
</script>

<header class="flex items-center gap-4 p-2 font-bold">
	<a href="/">
		<!-- <h1 class="text-2xl">Tix</h1> -->
		<img class="h-10 w-30" src="/raptor/bazaar/bazaar-text.svg" alt="raptor logo" />
	</a>
	<nav class="bg-yellow- flex w-full items-center gap-4">
		<!-- <a class:active={page.url.pathname === '/'} href="/">Home</a> -->
		<!-- <a class:active={page.url.pathname === '/checkout'} href="/checkout">Checkout</a> -->
		<a class="btn-bauhaus text-center" style="font-size:.65rem;" href="/freebee">Win a ticket</a>
		<a class:active={page.url.pathname === '/profile'} class="h-10 w-20 bg-[var(--third-color)] p-2 rounded-md flex justify-center items-center" href="/profile">
			<!-- <img src="/icons/raptor-head.svg" class="h-6" alt="profile"  /> -->
			 Account
		</a>
		<!-- <a class:active={page.url.pathname === '/checkout'} href="/checkout">checkout</a> -->
		<div class="flex-[1_0_auto]"></div>
		{#if user.token}
			<button onclick={user.logout} class="logout btn-bauhaus">Logout</button>
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
	button.logout {
		@apply px-[8px] py-[6px] text-[8px];
	}
</style>
