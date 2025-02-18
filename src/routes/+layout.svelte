<script>
	import { collectCookies } from '$lib';
	import Footer from '$lib/compontents/footer.svelte';
	import Header from '$lib/compontents/header.svelte';
	import cart from '$lib/stores/cart.svelte';
	import products from '$lib/stores/products.svelte';
	import user from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	let { data, children } = $props();


	onMount(() => {
		const { cartSession } = collectCookies();
		products.set(data.products);
		cart.set(cartSession);
		user.updateUser(data.user);
		user.updateToken(data.token);
	});
</script>

<Header />
{@render children()}
<Footer />
