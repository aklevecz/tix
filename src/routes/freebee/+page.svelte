<script>
	import AuthContainer from '$lib/compontents/auth/auth-container.svelte';
	import LoadingSpinner from '$lib/compontents/loading-spinner.svelte';
	import { generateQR } from '$lib/qr';
	import freebee from '$lib/stores/freebee.svelte';
	import user from '$lib/stores/user.svelte';
	import { concatDateTime } from '$lib/utils';
	import { onMount } from 'svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let days = $state(0);
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);

	let canWin = $state(false);
	let alreadyClaimed = $state(false);

	function updateCountdown() {
		if (!freebee.state.date || !freebee.state.time) {
			console.error(`Missing next freebee date or time`);
			return;
		}
		const target = concatDateTime(freebee.state.date, freebee.state.time).getTime();
		const now = new Date().getTime();

		let diff = target - now;
		if (diff < 0) {
			diff = 0;
		}

		days = Math.floor(diff / (1000 * 60 * 60 * 24));
		hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((diff % (1000 * 60)) / 1000);

		canWin = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
	}

	/** @type {*} */
	let interval;

	onMount(() => {
		freebee.init().then((res) => {
			if (res.message === 'You have already won!') {
				won = true;
			} else {
				if (!res.winner) {
					updateCountdown();

					interval = setInterval(updateCountdown, 1000);

					return () => {
						clearInterval(interval);
					};
				} else {
					canWin = false;
					alreadyClaimed = true;
				}
			}
		});
	});

	let won = $state(false);
	let isLoading = $state(false);
	async function onWin() {
		isLoading = true;
		if (!user.token) {
			alert('You must be signed in to win');
			return;
		}
		const { blob } = await generateQR(`freebee:${freebee.state.id}`);
		const response = await freebee.win({ qrBlob: blob });
		if (response.success) {
			won = true;
			alert(response.message);
		} else {
			alert(response.message);
		}
		isLoading = false;
	}

	let seo = {
		image: '/raptor/faight-2/og-image.jpg',
	};
</script>
<svelte:head>
	<meta property="og:image" content={seo.image} />
	<meta name="twitter:image" content={seo.image} />
</svelte:head>
<div class="mx-auto mb-10 flex min-h-[80vh] max-w-[600px] flex-col md:min-h-[90vh]">
	{#if !user.token}
		<div class="m-4 mb-10 rounded-md border p-1">
			<h1 class="mt-2 text-center text-lg font-bold">Sign in to win</h1>
			<AuthContainer />
		</div>
	{/if}

	<div class={user.token ? 'opacity-100' : 'opacity-25'}>
		<h1 class="p-0 text-center text-2xl font-bold">WIN A FREE TICKET</h1>

		{#if won}
			<p class="p-4 text-center text-5xl font-bold text-green-400">You won!</p>
			<div class="p-4 text-center text-2xl font-bold">
				Bao should have texted you your QR code, but you can also see it in your profile
			</div>

			<p class="filter-strobe mx-auto text-center text-[100px]">🎉</p>
			<a href="/profile" class="btn-bauhaus mx-auto mt-12 mb-4 block w-[175px] text-center text-xl">
				Go to profile
			</a>
		{/if}

		{#if !won}
			<div class="m-0">
				{#if (!canWin && !alreadyClaimed) || true}
					<!-- <h2 class="mb-2 text-xl font-semibold">Countdown</h2>
			<div>
				{days}
				{days === 1 ? 'day' : 'days'} , {hours}
				{hours === 1 ? 'hour' : 'hours'} ,
				{minutes}
				{minutes === 1 ? 'minute' : 'minutes'} , {seconds}
				{seconds === 1 ? 'second' : 'seconds'}
			</div> -->

					{#if canWin && !alreadyClaimed}
						<p class="cta-bubble text-green-500">OMG You can win! press the button!!!</p>
					{/if}
				{/if}

				{#if alreadyClaimed}
					<p class="mt-10 px-4 text-2xl font-bold">Todays freebee has been claimed</p>
					<p class="px-4 py-4 pr-0 text-lg font-bold">Check back tomorrow 😎</p>
				{/if}
			</div>
		{/if}
		{#snippet timeUnit(/** @type {{ value: number, label: string }} */ object)}
			<div class="rounded-lg border p-4 shadow-inner">
				<div class="mb-2 text-2xl font-bold text-[var(--third-color)]">
					{object.value.toString().padStart(2, '0')}
				</div>
				<div class="text-xs">{object.label}</div>
			</div>
		{/snippet}

		{#if !won}
			<div class:flashing={canWin} class="m-4 my-0 rounded-xl border p-6 shadow-2xl">
				<h2 class="mb-6 text-center text-xl font-semibold">Time Remaining</h2>
				<div class="grid grid-cols-3 justify-center gap-4 text-center">
					<!-- {@render timeUnit({ value: days, label: days === 1 ? 'Day' : 'Days' })} -->
					{@render timeUnit({ value: hours, label: hours === 1 ? 'Hr' : 'Hrs' })}
					{@render timeUnit({ value: minutes, label: minutes === 1 ? 'Min' : 'Mins' })}
					{@render timeUnit({ value: seconds, label: 'Secs' })}
					<!-- <TimeUnit value={days} label={days === 1 ? 'Day' : 'Days'} />
<TimeUnit value={hours} label={hours === 1 ? 'Hour' : 'Hours'} />
<TimeUnit value={minutes} label={minutes === 1 ? 'Minute' : 'Minutes'} />
<TimeUnit value={seconds} label={seconds === 1 ? 'Second' : 'Seconds'} /> -->
				</div>
			</div>
			{#if !canWin && !alreadyClaimed}
				<p class="cta-bubble text-lg ">
					Wait for the timer to finish and press the win button to claim the freebee today 🙃
				</p>
			{/if}
			{#if !alreadyClaimed}
				<!-- <h1 class="p-4 text-2xl font-bold">PRESS THIS BUTTON TO WIN</h1> -->
				<button onclick={onWin} class="win-button" class:pulse={canWin} class:faded={!canWin}
					>{#if isLoading}<LoadingSpinner />{:else}Win{/if}</button
				>
			{/if}
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	button.win-button {
		@apply m-auto mt-4 block w-[155px] bg-[var(--color-2)] p-4 text-3xl font-bold tracking-wide text-green-400 transition-colors duration-200 hover:bg-[var(--color-1)];
	}
	.flashing {
		animation: flashing 1s ease-in-out infinite;
	}
	.cta-bubble {
		@apply w-3/4 m-[2rem_auto] p-6 rounded-md text-center font-bold;
	}
	.faded {
		opacity: 0.5;
	}
	@keyframes flashing {
		0% {
			background-color: var(--color-2);
		}
		50% {
			background-color: greenyellow;
		}
		100% {
			background-color: var(--color-2);
		}
	}

	.filter-strobe {
		animation: strobe 200ms ease-in-out infinite;
	}

	@keyframes strobe {
		0% {
			filter: hue-rotate(0deg);
		}
		50% {
			filter: hue-rotate(180deg);
		}
		100% {
			filter: hue-rotate(0deg);
		}
	}

	.pulse {
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {200
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
