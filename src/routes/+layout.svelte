<script>
	import { collectCookies } from '$lib';
	import cart from '$lib/stores/cart.svelte';
	import Footer from '$lib/compontents/footer.svelte';
	import Header from '$lib/compontents/header.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		const {cartSession} = collectCookies()
		cart.set(cartSession);
});
</script>

<Header />
{@render children()}
<Footer />
