<script>
	import { EVENT_ID } from '$lib';
	import meApi from '$lib/api/me';
	import AuthContainer from '$lib/compontents/auth/auth-container.svelte';
	import CopyButton from '$lib/compontents/bits/copy-button.svelte';
	import user from '$lib/stores/user.svelte';
	import { createSharebeeHash, createSharebeeUrlBrowser } from '$lib/utils';
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

	/** @type {string} */
	let ordersUrls = $state('');

	/** @type {string} sharebeeQRUrl */
	let sharebeeQRUrl = $state('');

	/** @type {string} */
	let freebeeQRUrl = $state('');

	let followingSharebeeIsClaimed = $state(false);

	onMount(() => {
		meApi.getMe().then((data) => {
			console.log(data.orders);
			phoneNumber = data.phoneNumber;
			orders = data.orders;
			ordersUrls = data.ordersUrls;
			freebee = data.freebee;
			oldOrders = data.oldOrders;
			sharebee = data.sharebee;
			sharebeeQRUrl = data.sharebeeQRUrl;
			freebeeQRUrl = data.freebeeQRUrl;
			followingSharebeeIsClaimed = data.followingSharebeeIsClaimed;
		});
	});

	let fullScreenQRImgUrl = $state('');
	let qrCodeTitle = $state('');

	/** @type {(qrUrl:string, title?:string) => void} */
	function showQRCodeFullScreen(qrUrl, title = '') {
		fullScreenQRImgUrl = qrUrl;
		qrCodeTitle = title;
		document.body.classList.add('overflow-hidden');
	}

	function closeFullScreenQR() {
		fullScreenQRImgUrl = '';
		document.body.classList.remove('overflow-hidden');
	}
</script>

<h1 class="ml-4 flex items-center gap-4">
	<img
		src="/icons/raptor-head.svg"
		alt="raptor head"
		class="h-10 w-10 rounded-full bg-[var(--third-color)] p-2"
	/> Profile
</h1>
{#if fullScreenQRImgUrl}
	<div
		class="fixed top-0 left-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300"
	>
		<div class="relative max-w-lg rounded-xl bg-white p-4 shadow-2xl">
			{#if qrCodeTitle}
				<h2 class="mb-3 text-center text-xl font-semibold tracking-wider text-[var(--third-color)]">
					{qrCodeTitle}
				</h2>
			{/if}
			<div class="relative">
				<img
					src={fullScreenQRImgUrl}
					alt="QR Code"
					class="mx-auto h-auto w-full max-w-md rounded-lg border-4 border-amber-300 bg-white p-2"
				/>
			</div>
			<button onclick={closeFullScreenQR} class="btn-bauhaus m-[10px_auto_0] block"> Close </button>
		</div>
	</div>
{/if}

{#if !user.token}
	<div class="mx-auto mt-4">
		<h1 class="mb-4 text-center">Sign in to see your profile</h1>
		<div class="px-10 text-center">You will be able to see your tickets and other useful things</div>
		<AuthContainer />
	</div>
{/if}
{#if user.token}
	<div class="p-4">
		<h2>Phone: {phoneNumber}</h2>
		<img src="/api/img/raptor" alt="" class="h-[200px] w-[200px]" />
		<div class="section">
			<h1 class="mt-4 mb-2">Freebees</h1>
			{#if !freebee}
				<div>You have not won a freebee</div>
			{/if}
			{#if freebee}
				<div class="tracking-wider text-[var(--third-color)] capitalize">
					{freebee?.project_name.replace(/-/g, ' ')}
				</div>
				<div class="w-5/6 lowercase">You have a freebee!</div>
				<div
					onclick={() =>
						showQRCodeFullScreen(
							freebeeQRUrl,
							'Freebee: ' + freebee?.project_name.replace(/-/g, ' ')
						)}
					class="mt-2 inline-block cursor-pointer overflow-hidden rounded-lg border-2 border-amber-300 bg-white p-1 shadow-md transition-all hover:shadow-lg active:scale-95"
				>
					<img src={freebeeQRUrl} alt="freebee qr code" class="h-32 w-32 bg-amber-300" />
					<div class="mt-1 text-center text-xs text-gray-500">Tap to expand</div>
				</div>
			{/if}
		</div>
		<div class="section">
			<h1 class="mt-4">Orders</h1>
			{#if orders.length === 0 && oldOrders.length === 0}
				<div class="lowercase">You haven't ordered any tickets yet</div>
			{/if}
			<div class="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
				{#each ordersUrls as url}
					<div class="flex flex-col items-center">
						<div class="mb-1 text-center font-medium">Bazaar</div>
						<div
							onclick={() =>
								showQRCodeFullScreen(url)}
							class="inline-block cursor-pointer overflow-hidden rounded-lg border-2 border-amber-300 bg-white p-1 shadow-md transition-all hover:shadow-lg active:scale-95"
						>
							<img
								src={url}
								alt="order qr code"
								class="h-28 w-28 bg-amber-300"
							/>
							<div class="mt-1 text-center text-xs text-gray-500">Tap to expand</div>
						</div>
					</div>
				{/each}
			</div>
			{#if oldOrders.length > 0}
				<h3 class="mt-4 mb-2 text-lg font-medium">Past Orders</h3>
				<ul class="list-disc pl-5">
					{#each oldOrders as order}
						<li class="mb-1 capitalize">{order.event_name.replace(/-/g, ' ')}</li>
					{/each}
				</ul>
			{/if}
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
				<div
					onclick={() =>
						showQRCodeFullScreen(
							sharebeeQRUrl,
							'Sharebee: ' + sharebee?.project_name.replace(/-/g, ' ')
						)}
					class="mt-2 inline-block cursor-pointer overflow-hidden rounded-lg border-2 border-amber-300 bg-white p-1 shadow-md transition-all hover:shadow-lg active:scale-95"
				>
					<img src={sharebeeQRUrl} alt="sharebee qr code" class="h-32 w-32 bg-amber-300" />
					<div class="mt-1 text-center text-xs text-gray-500">Tap to expand</div>
				</div>

				{#if !followingSharebeeIsClaimed}
					<div class="mt-10">
						<div class="lowercase">You also have a sharebee to share with someone else</div>
						<div class="mt-2 rounded-md bg-gray-100 p-2 text-sm break-all">
							{createSharebeeUrlBrowser(createSharebeeHash(sharebee.id, phoneNumber))}
						</div>
						<div class="mt-2">
							<CopyButton
								link={createSharebeeUrlBrowser(createSharebeeHash(sharebee.id, phoneNumber))}
							/>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	h1 {
		@apply text-xl font-semibold text-[var(--third-color)];
	}
	h2 {
		@apply text-xl font-semibold text-[var(--third-color)];
	}
	.section {
		@apply my-6 rounded-lg border border-gray-200 px-4 pb-4 shadow-sm;
	}
</style>
