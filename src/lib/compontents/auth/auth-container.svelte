<script>
	import { browser } from '$app/environment';
	import { responses } from '$lib';
	import user from '$lib/stores/user.svelte';
	import PhoneInput from '../user/phone-input.svelte';

	const steps = {
		phone: 0,
		code: 1,
        authed: 2
	};

	let step = $state(steps.phone);

	let code = $state('');

	async function onSendCode() {
		const res = await user.sendCode(
			`${user.state.phoneNumber.countryCode}${user.state.phoneNumber.number}`
		);
		if (res.message === responses.CODE_SENT) {
			step = steps.code;
		}
	}

    async function onVerifyCode() {
        const res = await user.verifyCode(code);
        if (res.message === responses.AUTHED) {
            step = steps.authed;
            browser && window.location.reload()
        }
    }
</script>

<div class="flex flex-col items-center pb-4">
	{#if step === steps.phone}
		<PhoneInput />
		<button onclick={onSendCode} class="btn-bauhaus send-code">Send Code</button>
	{/if}
	{#if step === steps.code}
		<div>
			<div>Enter Code {code}</div>
			<input
				class="code"
				type="text"
				name="code"
				id="code"
				oninput={(/** @type {*} e */ e) => (code = e.target.value)}
				bind:value={code}
			/>
			<button onclick={onVerifyCode} class="btn-bauhaus mx-auto mt-2 block">Verify</button>
		</div>
	{/if}
    {#if step === steps.authed}
        <div>
            <div>Authed</div>
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
