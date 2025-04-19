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
		if (code.length !== 6 || !/^\d+$/.test(code)) return;
		
		fetching = true;
		const res = await user.verifyCode(code);
		if (res.message === responses.AUTHED) {
			step = steps.authed;
			browser && window.location.reload();
		} else {
			alert(res.message);
		}
		fetching = false;
	}
	
	/** @param {*} e */
	function handleCodeInput(e) {
		const value = e.target.value;
		
		// Only allow numeric input
		const numericValue = value.replace(/\D/g, '');
		
		// Limit to 6 digits
		code = numericValue.slice(0, 6);
		
		// Auto-submit when 6 digits are entered
		if (code.length === 6) {
			onVerifyCode();
		}
	}
	
	/** @param {*} e */
	function handleCodePaste(e) {
		e.preventDefault();
		
		// @ts-ignore
		const pastedText = (e.clipboardData || window.clipboardData).getData('text');
		
		// Extract numbers and limit to 6 digits
		const numericValue = pastedText.replace(/\D/g, '').slice(0, 6);
		
		// Update the code
		code = numericValue;
		
		// Auto-submit when 6 digits are pasted
		if (code.length === 6) {
			onVerifyCode();
		}
	}
</script>
<div class="flex flex-col items-center pb-4">
	{#if step === steps.phone}
		<div class="mt-4 px-10">
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
		<div class="my-4 px-6">enter the code you were just sent</div>
		<div>
			<div>
				<div>Enter Code</div>
				<input
					class="code"
					type="text"
					name="code"
					id="code"
					inputmode="numeric"
					maxlength="6"
					autocomplete="one-time-code"
					oninput={handleCodeInput}
					onpaste={handleCodePaste}
					onkeypress={(e) => {
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