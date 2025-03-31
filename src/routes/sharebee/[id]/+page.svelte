<script>
	import sharebee from '$lib/api/sharebee';
	import AuthContainer from '$lib/compontents/auth/auth-container.svelte';
	import CopyButton from '$lib/compontents/bits/copy-button.svelte';
	import user from '$lib/stores/user.svelte';
	import { createSharebeeUrl } from '$lib/utils';
	import { Byte, Encoder } from '@nuintun/qrcode';

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
	async function onClaim() {
		if (id) {
			const encoder = new Encoder({
				level: 'H'
			});

			const qrcode = encoder.encode(new Byte(id));

			const qrCodeUrl = qrcode.toDataURL(5, {
				// First arg: moduleSize is now 20
				margin: 4 // Optional margin
			});
			const qrBlob = await fetch(qrCodeUrl).then((res) => res.blob());

			const response = await sharebee.claim(id, qrBlob);
			const { success, sharebeeId } = response;
			if (success) {
				// generate.generateRaptor();
				newSharebeeUrl = createSharebeeUrl(sharebeeId);
			} else {
				console.log('fail');
			}
		}
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

<div class="container">
	<h1 class="title">Sharebees</h1>

	{#if !user.token}
		<h2 class="subtitle">You must sign in to claim a ticket</h2>
		<AuthContainer />
	{/if}

	{#if isShareer && !claimed_at}
		<div class="info">This is your ticket to share</div>
		<div class="info">It is still unclaimed. share it already!</div>
		<div class="link">{createSharebeeUrl(id)}</div>
		<div class="copy-wrapper">
			<CopyButton link={createSharebeeUrl(id)} />
		</div>
	{/if}

	{#if user.token}
		{#if !claimed_at && !newSharebeeUrl && !isShareer}
			<div class="hero">Free ticket - May 2nd</div>
			<img alt="raptor" class="raptor" src="/raptor/raptor-svg.svg" />
			<div class="mt-10 text-xl text-[var(--yellow)]">
				Someone sharebeed a free ticket with you to the party at the faight on may 2nd ({id})
			</div>
			<button onclick={onClaim} class="btn-claim">claim ticket</button>
		{/if}

		{#if newSharebeeUrl}
			<div class="info">woohoo! you have a ticket to the party!</div>
			<div class="info">
				You have a sharebee to share with a friend now. Send them this link and they will be able to
				claim a free ticket
			</div>
			<div class="link">{newSharebeeUrl}</div>
			<div class="copy-wrapper">
				<CopyButton link={newSharebeeUrl} />
			</div>
		{/if}

		{#if claimed_at}
			<div class="status">This ticket has been claimed</div>
			<!-- <div class="date">{formatDate(claimed_at)}</div> -->
			<div class="highlight">Oh it was claimed by you!</div>
			<img alt="raptor" class="raptor my-8" src="/raptor/raptor-svg.svg" />
			{#if isWinner && followingSharebeeUrl}
				<div class="status">Here is you link to share</div>
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
		min-height: 85vh;
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
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
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

	/* UI Elements */
	.raptor {
		margin-left: auto;
		margin-right: auto;
		height: 10rem;
		width: 10rem;
		filter: invert(1);
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
		margin-top: auto;
		font-size: 1.875rem;
		line-height: 2.25rem;
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
