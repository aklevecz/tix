<script>
	import user from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';
	import TextInput from './text-input.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	import { parsePhoneNumberFromString } from 'libphonenumber-js';

	let { fullName, email, phoneNumber } = $derived(user.state);

	onMount(() => {
		if (browser) {
			//scroll to form
			setTimeout(() => {
				document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
			}, 100);
		}
	});

	function goToPayment() {
		if (!fullName || !email || !phoneNumber) {
			alert('Please fill out all fields');
			return;
		}
		// const countryCodePattern = /^\d{1,4}\s/;
		// if (countryCodePattern.test(phoneNumber)) {
		// 	phoneNumber = '+' + phoneNumber;
		// }
		let validPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'US');
		user.updateUser({phoneNumber: validPhoneNumber?.number});
		goto('/checkout/pay');
	}
</script>

<form class="mx-auto max-w-lg space-y-4 p-4">
	<h2 class="text-4xl font-bold tracking-tight text-[var(--secondary-color)] uppercase">INFO</h2>
	<div class="space-y-2">
		<label for="name">Name</label>
		<TextInput name="fullName" placeholder="Your Name" value={fullName} />
	</div>

	<div class="space-y-2">
		<label for="phone">Phone</label>
		<TextInput name="phoneNumber" placeholder="Your Phone" value={phoneNumber} />
	</div>

	<div class="space-y-2">
		<label for="email">Email</label>
		<TextInput name="email" placeholder="Your Email" value={email} />
	</div>
</form>
<button onclick={goToPayment} class="btn-bauhaus mx-auto mt-4 block w-9/12"> Continue </button>

<style lang="postcss">
	@reference "tailwindcss/theme";
	label {
		@apply block tracking-wide text-[var(--secondary-color)] uppercase;
	}
	input {
		@apply w-full border border-[var(--secondary-color)] bg-transparent p-2 text-[var(--secondary-color)] focus:border-[var(--color-1)] focus:outline-none;
	}
</style>
