<script>
	import freebee from '$lib/stores/freebee.svelte';
	import { dateAndTimeToDateZ } from '$lib/utils';
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
		if (!freebee.state.nextFreebeeDate || !freebee.state.nextFreebeeTime) {
			console.error(`Missing next freebee date or time`);
			return;
		}
		const target = dateAndTimeToDateZ(
			freebee.state.nextFreebeeDate,
			freebee.state.nextFreebeeTime
		).getTime();
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
		});
	});

	async function onWin() {
		const response = await freebee.win();
		if (response.success) {
			alert(response.message);
		} else {
			alert(response.message);
		}
	}
</script>

<div class="min-h-[79.6vh]">
	<h1 class="p-4 text-2xl font-bold">Check here for free tickets</h1>

	<div class="p-4">
		{#if !canWin && !alreadyClaimed}
			<h2 class="mb-2 text-xl font-semibold">Countdown</h2>
			<div>
				{days}
				{days === 1 ? 'day' : 'days'} , {hours}
				{hours === 1 ? 'hour' : 'hours'} ,
				{minutes}
				{minutes === 1 ? 'minute' : 'minutes'} , {seconds}
				{seconds === 1 ? 'second' : 'seconds'}
			</div>
		{/if}

		{#if alreadyClaimed}
			<h2 class="mb-2 text-xl font-semibold">Todays freebee has been claimed</h2>
			<h2>Check back tomorrow</h2>
		{/if}

		{#if canWin && !alreadyClaimed}
			<h2 class="mb-2 text-xl font-semibold">OMG You can win! press the button!!!</h2>
		{/if}
	</div>

	{#if !alreadyClaimed}
		<h1 class="p-4 text-2xl font-bold">PRESS THIS BUTTON TO WIN</h1>
		<button onclick={onWin} class="win-button">WIN</button>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	button.win-button {
		@apply m-auto block w-9/12 p-4 text-3xl font-bold text-[var(--secondary-color)] bg-[var(--color-2)] transition-colors duration-200 hover:bg-[var(--color-1)];
	}
</style>
