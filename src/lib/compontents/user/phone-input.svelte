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

	/** @type {import('libphonenumber-js').CountryCode }*/
	let selectedCountry = $state('US');
	let phone = $state('');
	let error = $state('');

    let phoneValue = $derived(user.state.phoneNumber.number)
	function validatePhone() {
		if (!phone.trim()) {
			error = '';
			return;
		}
		try {
			const parsed = parsePhoneNumberFromString(phone, selectedCountry);
			if (parsed && parsed.isValid()) {
				error = '';
			} else {
				error = 'Invalid phone number';
			}
		} catch (err) {
			error = 'Invalid phone number';
		}
	}

	const getCountryPrefix = () => {
		return countries.find((c) => c.code === selectedCountry)?.dialCode || '+1';
	};

	/** @param {*} e*/
	function handleInput(e) {
		phone = e.target.value;
		validatePhone();
		user.updateUser({
			phoneNumber: {
				number: phone,
				countryCode: getCountryPrefix()
			}
		});
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
		<input type="tel" placeholder="Enter phone number" value={phoneValue} oninput={handleInput} />
	</div>
	{#if error}
		<div class="error">{error}</div>
	{/if}
</div>

<style lang="postcss">
    @reference "tailwindcss/theme";
	.phone-input-container {
		max-width: 400px;
		margin: 20px auto;
	}

	.phone-input {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	select {
		padding: 10px;
		border: 1px solid;
		font-size: 1rem;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg width='10' height='5' viewBox='0 0 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 5 5-5z' fill='%23666'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 10px center;
		background-size: 10px 5px;
        @apply text-sm;
	}

    label {
        @apply text-sm;
    }

	input {
		flex: 1;
		padding: 10px;
		border: 1px solid;
		font-size: 1rem;
        @apply text-sm;
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
