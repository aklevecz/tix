<!-- <script>
    import { createEventDispatcher } from 'svelte';
    import { parsePhoneNumberFromString } from 'libphonenumber-js';
  
    const dispatch = createEventDispatcher();
  
    // The phone number and country are exported so you can bind to them from a parent.

   -->

<script>
	import { parsePhoneNumberFromString } from 'libphonenumber-js';

	import countries from './countries';
	import user from '$lib/stores/user.svelte';

	let { onSubmit, hasSubmittedCode = $bindable() } = $props();

	/** @type {import('libphonenumber-js').CountryCode }*/
	let selectedCountry = $state('US');
	let phone = $state('');
	let error = $state('');

	let phoneValue = $derived(user.state.phoneNumber.number);

	function validatePhone() {
		if (!phone.trim()) {
			error = '';
			return { phoneNumberNoCountryCode: '', countryCode: '' };
		}
		try {
			const parsed = parsePhoneNumberFromString(phone, selectedCountry);
			console.log(parsed)
			console.log(user.state.phoneNumber)
			if (parsed && parsed.isValid()) {
				error = '';
				return { phoneNumberNoCountryCode: parsed.nationalNumber, countryCode: '+' + parsed.countryCallingCode };
			} else {
				error = hasSubmittedCode ? 'Invalid phone number' : 'Phone number appears to be incomplete...';
			}
		} catch (err) {
			console.log(err);
			error = hasSubmittedCode ? 'Invalid phone number' : 'Phone number appears to be incomplete...';
		}
		return { phoneNumberNoCountryCode: '' };
	}

	$effect(() => {
		if (hasSubmittedCode) {
			validatePhone();
		}
	});

	const getCountryPrefix = () => {
		return countries.find((c) => c.code === selectedCountry)?.dialCode || '+1';
	};

	/** @param {*} e*/
	function handleInput(e) {
		hasSubmittedCode = false;
		phone = e.target.value;
		const { phoneNumberNoCountryCode, countryCode } = validatePhone();
		console.log(`phoneNumberNoCountryCode: ${phoneNumberNoCountryCode}, countryCode: ${countryCode}`);
		if (phoneNumberNoCountryCode) {
			user.updateUser({
				phoneNumber: {
					number: phoneNumberNoCountryCode,
					countryCode: getCountryPrefix()
				}
			});
		}
	}

	/** @param {*} e*/
	function handleCountryChange(e) {
		selectedCountry = e.target.value;
		validatePhone();
		user.updateUser({ phoneNumber: { number: phone, countryCode: getCountryPrefix() } });
	}
</script>

<div class="phone-input-container">
	<label for="phone">Phone Number</label>
	<div class="phone-input">
		<select bind:value={selectedCountry} onchange={handleCountryChange}>
			{#each countries as country}
				<option value={country.code}>
					{country.flag}
					{country.dialCode}
				</option>
			{/each}
		</select>
		<input
			onkeypress={(e) => {
				if (e.key === 'Enter') {
					onSubmit();
				}
			}}
			type="tel"
			placeholder="Enter phone number"
			value={phoneValue}
			oninput={handleInput}
		/>
	</div>
	{#if error}
		<div class="error">{error}</div>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	.phone-input-container {
		/* max-width: 200px; */
		margin: 20px auto;
	}

	.phone-input {
		display: flex;
		gap: 4px;
		/* align-items: center; */
	}

	select {
		padding: 10px 6px;
		border: 1px solid;
		font-size: 1rem;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg width='10' height='5' viewBox='0 0 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 5 5-5z' fill='%23666'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 10px center;
		background-size: 10px 5px;
		flex: 0 0 10%;
		@apply text-sm;
	}

	label {
		@apply mb-1 text-sm;
	}

	input {
		padding: 10px;
		border: 1px solid;
		font-size: 1rem;
		width: 235px;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #0070f3;
		box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
	}

	.error {
		margin-top: 6px;
		color: #e74c3c;
		font-size: 0.875rem;
		text-align: center;
	}
</style>
