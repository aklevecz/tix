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
	import { parse } from 'svelte/compiler';
	import { onMount } from 'svelte';

	let { onSubmit, hasSubmittedCode = $bindable(), phoneNumberIsValid = $bindable() } = $props();
	/** @param {string} dialCode  */
	const dialCodeToCode = (dialCode) => {
		return countries.find((c) => c.dialCode === `${dialCode}`)?.code || 'US';
	};
	console.log(user.state.phoneNumber)
	// let selectedCountry = $derived(dialCodeToCode(user.state.phoneNumber.countryCode));
	/** @type {*} */
	let initialCountry = dialCodeToCode(user.state.phoneNumber.countryCode);
	console.log(initialCountry)
	/** @type {import('libphonenumber-js').CountryCode }*/
	let selectedCountry = $state(initialCountry);
	let phone = $state(user.state.phoneNumber.number || '');
	let error = $state('');

	// This needs to be simplified there are too many variables manipulating the phone number
	let phoneValue = $derived(user.state.phoneNumber.number);

	function validatePhone() {
		phoneNumberIsValid = false;
		if (!phone.trim()) {
			error = '';
			return { phoneNumberNoCountryCode: '', countryCode: '', overrideCountryCode: false };
		}
		try {
			console.log(selectedCountry)
			const parsed = parsePhoneNumberFromString(phone, selectedCountry);
			if (parsed && parsed.isValid()) {
				phoneNumberIsValid = true;
				// not sure about this over complicated changing of country code
				let countryCode = '';
				let overrideCountryCode = false;
				console.log(`getCountryPrefix(): ${getCountryPrefix()}`);
				console.log(`parsed.countryCallingCode: ${parsed.countryCallingCode}`);
				if (getCountryPrefix() !== `+${parsed.countryCallingCode}`) {
					if (phone.startsWith(parsed.countryCallingCode)) {
						countryCode = `+${parsed.countryCallingCode}`;
						overrideCountryCode = true;
					}
				}
				error = '';
				return {
					phoneNumberNoCountryCode: parsed.nationalNumber,
					countryCode,
					overrideCountryCode
				};
			} else {
				error = hasSubmittedCode
					? 'Invalid phone number'
					: 'Phone number appears to be incomplete...';
			}
		} catch (err) {
			console.log(err);
			error = hasSubmittedCode
				? 'Invalid phone number'
				: 'Phone number appears to be incomplete...';
		}
		return { phoneNumberNoCountryCode: '', countryCode: '', overrideCountryCode: false };
	}

	$effect(() => {
		if (hasSubmittedCode) {
			validatePhone();
		}
	});

	onMount(() => {
		if (phone) {
			validatePhone();
		}
	})

	const getCountryPrefix = () => {
		return countries.find((c) => c.code === selectedCountry)?.dialCode || '+1';
	};

	/** @param {*} e*/
	function handleInput(e) {
		hasSubmittedCode = false;
		phone = e.target.value;
		const { phoneNumberNoCountryCode, countryCode, overrideCountryCode } = validatePhone();

		// override seems to have too many side effects
		if (overrideCountryCode) {
			// @ts-ignore
			// selectedCountry = dialCodeToCode(countryCode);
		}
		// if (phoneNumberNoCountryCode) {
		user.updateUser({
			phoneNumber: {
				number: phoneNumberNoCountryCode || phone,
				countryCode:  getCountryPrefix()
			}
		});
		// }
	}

	/** @param {*} e*/
	function handleCountryChange(e) {
		selectedCountry = e.target.value;
		// const { phoneNumberNoCountryCode } = validatePhone();
		user.updateUser({
			phoneNumber: { ...user.state.phoneNumber, countryCode: getCountryPrefix() }
		});
	}
</script>

<div class="phone-input-container">
	<label for="phone">Phone Number</label>
	<div class="phone-input">
		<!-- {selectedCountry} -->
		<!-- <select bind:value={selectedCountry} onchange={handleCountryChange}> -->
		<select value={selectedCountry} onchange={handleCountryChange}>
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
			value={phone}
			oninput={handleInput}
		/>
			<!-- value={phoneValue} -->
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
