<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import user from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';
	import TextInput from './text-input.svelte';

	import PhoneInput from '../user/phone-input.svelte';
	import { fade, slide } from 'svelte/transition';

	let { fullName, email, phoneNumber } = $derived(user.state);

	onMount(() => {
		if (browser && window.innerWidth < 768) {
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
		// let validPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'US');
		// user.updateUser({ phoneNumber: validPhoneNumber?.number });
		goto('/checkout/pay');
	}
</script>
<form class="px-4 mb-6 space-y-4">
	<h2 class="text-2xl font-bold tracking-tight text-[var(--secondary-color)] uppercase">INFO</h2>
	<!-- <div class="flex gap-1"> -->
		<div class="flex-[0_0_40%]">
			<label for="name">Name</label>
			<TextInput name="fullName" placeholder="Your Name" value={fullName} />
		</div>
		<div class="space-y-0 flex-1">
			<label for="email">Email</label>
			<TextInput name="email" placeholder="Your Email" value={email} />
		</div>
	<!-- </div> -->
	<PhoneInput />

</form>
<button onclick={goToPayment} class="btn-bauhaus mx-auto mt- block w-[175px]"> Continue </button>

<style lang="postcss">
	@reference "tailwindcss/theme";
	label {
		@apply text-sm mb-1;
	}
</style>
