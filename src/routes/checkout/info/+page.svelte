<script>
	import UserForm from '$lib/compontents/checkout/user-form.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<UserForm />
<div class="mb-10"></div>
