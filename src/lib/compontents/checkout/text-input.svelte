<script>
	import user from '$lib/stores/user.svelte';

	let { name, placeholder, value, autocomplete, type } = $props();

	/** @param {*} e */
	function onChange(e) {
		user.updateUser({ [name]: e.target.value });
	}
</script>

<input {name} {autocomplete} {type} oninput={onChange} {placeholder} bind:value required class="" />

<style lang="postcss">
	@reference "tailwindcss/theme";
	input {
		@apply w-70 border border-[var(--secondary-color)] bg-transparent p-2 text-base text-[var(--secondary-color)] focus:border-[var(--color-1)] focus:outline-none;
	}
</style>
