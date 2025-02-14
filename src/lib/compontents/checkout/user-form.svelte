<script>
	import user from '$lib/stores/user.svelte';
	import Slider from './slider.svelte';
	import TextInput from './text-input.svelte';

	let { fullName, email, phoneNumber } = $derived(user.state);
</script>

<Slider />

<form class="mx-auto max-w-lg space-y-4 bg-[#1a1a1a] p-4">
	<h2 class="text-4xl font-bold tracking-tight text-white uppercase">INFO</h2>
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

	<!-- <button class="btn-bauhaus mt-4 w-full"> Submit </button> -->
</form>

<style lang="postcss">
	@reference "tailwindcss/theme";
	label {
		@apply block tracking-wide text-white uppercase;
	}
	input {
		@apply w-full border border-white bg-transparent p-2 text-white focus:border-[var(--red)] focus:outline-none;
	}
</style>
