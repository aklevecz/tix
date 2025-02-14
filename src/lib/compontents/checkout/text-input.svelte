<script>
	import user from '$lib/stores/user.svelte';

	let { name, placeholder, value } = $props();

	/** @param {*} e */
	function onChange(e) {
		user.updateUser({ [name]: e.target.value });
	}
</script>

<input {name} oninput={onChange} type="text" {placeholder} bind:value required class="" />

<style lang="postcss">
	@reference "tailwindcss/theme";
	input {
		@apply w-full border border-white bg-transparent p-2 text-white focus:border-[var(--red)] focus:outline-none;
	}
</style>
