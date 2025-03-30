<script>
	import { browser } from '$app/environment';
	import { responses } from '$lib';
	import user from '$lib/stores/user.svelte';
	import LoadingSpinner from '../loading-spinner.svelte';
	import PhoneInput from '../user/phone-input.svelte';

	const steps = {
		phone: 0,
		code: 1,
		authed: 2
	};

	let step = $state(steps.phone);

	let code = $state('');

	let fetching = $state(false);

	let hasSubmittedCode = $state(false);

	async function onSendCode() {
		hasSubmittedCode = true;
		fetching = true;
		const res = await user.sendCode(
			`${user.state.phoneNumber.countryCode}${user.state.phoneNumber.number}`
		);
		if (res.message === responses.CODE_SENT) {
			step = steps.code;
		}
		fetching = false;
	}

	async function onVerifyCode() {
		fetching = true;
		const res = await user.verifyCode(code);
		if (res.message === responses.AUTHED) {
			step = steps.authed;
			browser && window.location.reload();
		}
		fetching = false;
	}
</script>

<div class="flex flex-col items-center pb-4">
	{#if step === steps.phone}
		<div class="mt-4 px-6 text-white lowercase">
			Enter your phone number and look out for a verification code
		</div>
		<PhoneInput onSubmit={onSendCode} {hasSubmittedCode} />
		<button onclick={onSendCode} class="btn-bauhaus send-code"
			>{#if fetching}
				<LoadingSpinner />
			{:else}
				Send Code{/if}
		</button>
	{/if}
	{#if step === steps.code}
		<div class="my-4 px-6 text-white lowercase">enter the code you were just sent</div>
		<div>
			<div>
				<div>Enter Code {code}</div>
				<input
					class="code"
					type="text"
					name="code"
					id="code"
					oninput={(/** @type {*} e */ e) => (code = e.target.value)}
					onkeypress={(/** @type {*} e */ e) => {
						console.log(e.key)
						if (e.key === 'Enter') {
							onVerifyCode();
						}
					}}
					bind:value={code}
				/>
				<button onclick={onVerifyCode} class="btn-bauhaus mx-auto mt-2 block">
					{#if fetching}
						<LoadingSpinner />
					{:else}
						Verify{/if}
				</button>
			</div>
			<div class="mt-12 flex flex-col gap-3">
				<div class="text-sm text-[var(--third-color)]">
					a code was sent to <span class="ml-2 text-[var(--secondary-color)]"
						>{user.state.phoneNumber.number}</span
					>
				</div>
				<button onclick={onSendCode} class="btn-bauhaus sm mx-auto">send code again</button>
				<button onclick={() => (step = steps.phone)} class="btn-bauhaus sm mx-auto"
					>change number</button
				>
			</div>
		</div>
	{/if}
	{#if step === steps.authed}
		<div>
			<div>You have successfully signed in</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	input.code {
		@apply w-50;
	}
	.send-code {
		@apply mx-auto block text-sm;
	}
</style>
