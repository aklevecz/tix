<script>
	import meApi from '$lib/api/me';
	import AuthContainer from '$lib/compontents/auth/auth-container.svelte';
	import CopyButton from '$lib/compontents/bits/copy-button.svelte';
	import user from '$lib/stores/user.svelte';
	import { createSharebeeHash, createSharebeeUrl } from '$lib/utils';
	import { onMount } from 'svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let phoneNumber = $state('');
	/** @type {TixOrder[]} */
	let orders = $state([]);

	/** @type {{project_name:string}} */
	let freebee = $state({ project_name: '' });

	/** @type {*} */
	let oldOrders = $state([]);

	/** @typedef {Object} Sharebee
	 * @property {string} id
	 * @property {string} project_name
	 * @property {string} created_at
	 * @property {string} claimed_at
	 * @property {string} winner
	 */

	/** @type {Sharebee | null} */
	let sharebee = $state(null);

	/** @type {string} sharebeeQRUrl */
	let sharebeeQRUrl = $state('')

	onMount(() => {
		meApi.getMe().then((data) => {
			phoneNumber = data.phoneNumber;
			orders = data.orders;
			freebee = data.freebee;
			oldOrders = data.oldOrders;
			sharebee = data.sharebee;
			sharebeeQRUrl = data.sharebeeQRUrl
		});
	});
</script>

<h1 class="ml-4">Profile</h1>
{#if !user.token}
	<div class="mx-auto mt-4">
		<h1 class="mb-4 text-center">Sign in to see your profile</h1>
		<AuthContainer />
	</div>
{/if}
{#if user.token}
	<div class="p-4">
		<h2>Phone: {phoneNumber}</h2>
		<img src="/api/img?id={phoneNumber}/raptor.jpeg" alt="" class="h-[200px] w-[200px]" />
		<div class="section">
			<h1 class="mt-4 mb-2">Freebees</h1>
			{#if !freebee}
				<div>You have not won a freebee</div>
			{/if}
			{#if freebee}
				<div class="tracking-wider text-[var(--third-color)] capitalize">
					{freebee?.project_name.replace(/-/g, ' ')}
				</div>
				<div class="w-5/6 lowercase">
					You have a freebee! Ari will confirm with you at some point and eventually send you a QR
					code
				</div>
			{/if}
		</div>
		<div class="section">
			<h1 class="mt-4">Orders</h1>
			{#if orders.length === 0 && oldOrders.length === 0}
				<div class="lowercase">You haven't ordered any tickets yet</div>
			{/if}
			{#each orders as order}
				<div>{order.project_name}</div>
			{/each}
			{#each oldOrders as order}
				<div>{order.event_name.replace(/-/g, ' ')}</div>
			{/each}
		</div>

		<div class="section">
			<h1 class="mt-4">Sharebees</h1>
			{#if !sharebee}
				<div>You have not claimed a sharebee</div>
			{/if}
			{#if sharebee}
				<div class="tracking-wider text-[var(--third-color)] capitalize">
					{sharebee?.project_name.replace(/-/g, ' ')}
				</div>
				<div class="w-5/6 lowercase">You got a free ticket!</div>
				<img src={sharebeeQRUrl} alt="sharebee qr code" class="w-30 h-30 bg-amber-300">
				<div class="lowercase">You also have a sharebee to share with someone else</div>
				<!-- <div>
					{createSharebeeUrl(createSharebeeHash(sharebee.id, phoneNumber))}
				</div> -->
				<CopyButton link={createSharebeeUrl(createSharebeeHash(sharebee.id, phoneNumber))} />
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	h1 {
		@apply text-xl font-semibold tracking-widest text-[var(--third-color)];
	}
	h2 {
		@apply text-xl font-semibold text-[var(--third-color)];
	}
	.section {
		@apply p-1;
	}
</style>
