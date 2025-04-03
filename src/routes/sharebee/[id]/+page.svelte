<script>
	import sharebee from '$lib/api/sharebee';
	import AuthContainer from '$lib/compontents/auth/auth-container.svelte';
	import CopyButton from '$lib/compontents/bits/copy-button.svelte';
	import LoadingSpinner from '$lib/compontents/loading-spinner.svelte';
	import { generateQR } from '$lib/qr';
	import user from '$lib/stores/user.svelte';
	import { createSharebeeUrlBrowser } from '$lib/utils';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	const {
		id,
		project_name,
		claimed_at,
		isWinner,
		followingSharebeeId,
		followingSharebeeUrl,
		isShareer
	} = data;

	let newSharebeeUrl = $state('');
	let isClaiming = $state(false);
	async function onClaim() {
		isClaiming = true;
		if (id) {
			const { blob: qrBlob } = await generateQR(`sharebee:${id}`);

			const response = await sharebee.claim(id, qrBlob);
			const { success, sharebeeId } = response;
			if (success) {
				// generate.generateRaptor();
				newSharebeeUrl = createSharebeeUrlBrowser(sharebeeId);
			} else {
				alert('couldnt claim -- probably already claimed or something else-- try refreshing');
			}
		}
		isClaiming = false;
	}

	function resetSharebees() {
		sharebee.reset().then((res) => {
			if (res.success) {
				// alert('All sharebees have been reset.');
			} else {
				// alert('Failed to reset sharebees.');
			}
		});
	}
</script>

<svelte:head>
	<title>Sharebees</title>
	<meta property="og:title" content="Sharebees" />
	<meta property="og:description" content="Sharebees" />
	<meta property="og:image" content="/raptor/faight-2/sharebee-preview-2.jpg" />
	<meta name="twitter:image" content="/raptor/faight-2/sharebee-preview-2.jpg" />
</svelte:head>
{#snippet raptorImg()}
<div class="raptor-img-container">
	<img
		alt="raptor"
		class="raptor absolute mix-blend-color"
		src="/raptor/faight-2/dinotopia-raptor.svg"
	/>
	<img alt="raptor" class="raptor" src="/raptor/faight-2/sharebee-img.jpg" />
</div>
{/snippet}
<div class="container">
	<!-- <h1 class="title">Sharebees</h1> -->
	{#if !user.token}
		<div class="w-full">
			<h2 class="subtitle">You must sign in to claim a ticket</h2>
			<AuthContainer />
		</div>
	{/if}

	{#if isShareer && !claimed_at}
		<div class="info">This is your ticket to share</div>
		{@render raptorImg()}
		<div class="info">It is still unclaimed. share it already!</div>
		<div class="link">{createSharebeeUrlBrowser(id)}</div>
		<div class="copy-wrapper">
			<CopyButton link={createSharebeeUrlBrowser(id)} />
		</div>
	{/if}

	{#if user.token}
		{#if !claimed_at && !newSharebeeUrl && !isShareer}
			<div class="hero">Free ticket</div>
			{@render raptorImg()}
			<div class="mt-8 px-8 text-2xl text-[var(--yellow)]">
				Someone sharebeed a free ticket with you to the party at on may 2nd
			</div>
			<button onclick={onClaim} class="btn-claim"
				>{#if isClaiming}
					<LoadingSpinner />
				{:else}
					claim ticket{/if}</button
			>
		{/if}

		{#if newSharebeeUrl}
			<div class="info">woohoo! you have a ticket to the party!</div>
			{@render raptorImg()}
			<div class="info">Here is your own sharebee to send to a friend now</div>
			<div class="link">{newSharebeeUrl}</div>
			<div class="copy-wrapper">
				<CopyButton link={newSharebeeUrl} />
			</div>
		{/if}

		{#if claimed_at}
			<div class="status">This ticket has been claimed</div>
			<!-- <div class="date">{formatDate(claimed_at)}</div> -->
			{@render raptorImg()}
			{#if !isWinner}
				<div class="text-2xl">See if your friend has another one or bug @teh.raptor 🙃</div>
			{/if}
			{#if isWinner && followingSharebeeUrl}
				<!-- <div class="highlight text-center mb-4">Oh it was claimed by you!</div> -->
				<div class="status">Here is your ticket to sharebee with a friend</div>
				<div class="link mt-4">{followingSharebeeUrl}</div>
				<div class="copy-wrapper">
					<CopyButton link={followingSharebeeUrl} />
				</div>
			{/if}
		{/if}
	{/if}

	<!-- <button class="btn-admin" onclick={resetSharebees}
		>RESET ALL SHAREBEES WITH TESTING PURPOSES</button
	> -->
</div>

<style>
	/* Base container */
	.container {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		min-height: 75vh;
		width: 90%;
		max-width: 32rem;
	}

	/* Typography */
	.title {
		margin-top: 0.5rem;
		margin-bottom: 0.75rem;
		font-size: 1.875rem;
		line-height: 2.25rem;
		color: var(--third-color);
	}

	.subtitle {
		margin-bottom: 1rem;
		font-size: 1.5rem;
		line-height: 2rem;
	}

	.hero {
		margin-bottom: 1rem;
		text-align: center;
		font-size: 1.75rem;
		line-height: 2.5rem;
	}

	.info {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
		line-height: 2rem;
		color: var(--yellow);
	}

	.status {
		/* margin-top: 1rem; */
		font-size: 1.5rem;
		line-height: 2rem;
	}

	.date {
		font-size: 1rem;
		line-height: 1.5rem;
	}

	.highlight {
		margin-top: 1rem;
		font-size: 1.5rem;
		line-height: 2rem;
		color: var(--third-color);
	}

	.raptor-img-container {
		position: relative;
		width: 250px;
		height: 250px;
		margin: auto;
	}
	/* UI Elements */
	.raptor {
		margin-left: auto;
		margin-right: auto;
		height: 100%;
		width: 100%;
		/* filter: invert(1); */
	}

	.link {
		width: 90%;
		word-break: break-word;
		color: var(--yellow);
	}

	.copy-wrapper {
		margin-right: auto;
	}

	/* Buttons */
	.btn-claim {
		margin: 50px auto;
		font-size: 1.875rem;
		line-height: 2.75rem;
		width: 250px;
		/* margin: auto auto; */
		animation: glow 1s ease-in-out infinite alternate;
	}

	.btn-admin {
		margin-top: 5rem;
		font-size: 0.75rem;
		line-height: 1rem;
	}

	button {
		animation: glow 1s ease-in-out infinite alternate;
	}

	/* We're keeping the original copy-button style assuming it's defined in the imported component */
	:global(.copy-btn) {
		height: 5rem;
		width: 5rem;
		border-radius: 9999px;
		background-color: var(--yellow);
		padding: 0.5rem;
		font-size: 1.25rem;
		line-height: 1.75rem;
		color: var(--third-color);
		animation: none;
	}

	/* Animations */
	@keyframes glow {
		from {
			box-shadow: 0 0 5px var(--purple);
			color: var(--purple);
		}
		to {
			box-shadow: 0 0 20px var(--purple);
			color: var(--yellow);
		}
	}
</style>
