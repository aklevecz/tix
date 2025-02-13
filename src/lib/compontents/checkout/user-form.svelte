<script>
	let name = '';
	let phone = '';
	let email = '';

	function onSubmit() {}
</script>

<form on:submit={onSubmit} class="mx-auto max-w-lg space-y-4 bg-[#1a1a1a] p-4">
	<h2 class="text-4xl font-bold tracking-tight text-white uppercase">User Information</h2>

	<div class="space-y-2">
		<label for="name">Name</label>
		<input id="name" type="text" bind:value={name} placeholder="Your Name" required class="" />
	</div>

	<div class="space-y-2">
		<label for="phone">Phone</label>
		<input id="phone" type="tel" bind:value={phone} placeholder="Your Phone" required />
	</div>

	<div class="space-y-2">
		<label for="email">Email</label>
		<input id="email" type="email" bind:value={email} placeholder="Your Email" required />
	</div>

	<button
    class="btn-bauhaus w-full mt-4"
	>
		Submit
	</button>
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
