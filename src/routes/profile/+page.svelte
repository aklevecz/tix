<script>
	import meApi from '$lib/api/me';
	import AuthContainer from '$lib/compontents/auth/auth-container.svelte';
	import user from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let phoneNumber = $state('');
	/** @type {TixOrder[]} */
	let orders = $state([]);

	/** @type {{id:string}} */
	let freebee = $state({ id: '' });

	onMount(() => {
		meApi.getMe().then((data) => {
			phoneNumber = data.phoneNumber;
			orders = data.orders;
			freebee = data.freebee;
		});
	});
</script>

{#if !user.token}
	<div class="mx-auto">
		<h1>Sign in to see your profile</h1>
		<AuthContainer />
	</div>
{/if}

{#if user.token}
<div class="p-4">
	<h1>{phoneNumber}</h1>
	<img src="/api/img?id={phoneNumber}/raptor.jpeg" alt="" />
	<h1 class="mt-4">Freebees</h1>
	{freebee?.id}

	<h1 class="mt-4">Orders</h1>
	{#each orders as order}
		<div>{order.project_name}</div>
	{/each}
</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	h1 {
		@apply text-xl font-semibold;
	}
</style>
