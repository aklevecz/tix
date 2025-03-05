<script>
	import { collectCookies } from '$lib';
	import Footer from '$lib/compontents/footer.svelte';
	import Header from '$lib/compontents/header.svelte';
	import cart from '$lib/stores/cart.svelte';
	import products from '$lib/stores/products.svelte';
	import user from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { redirect } from '@sveltejs/kit';

	let { data, children } = $props();

	onMount(() => {
		const { cartSession } = collectCookies();
		products.set(data.products);
		cart.set(cartSession);
		user.updateUser(data.user);
		user.updateToken(data.token);
	});
	
	const primaryColor = data.featured?.primaryColor || '#ffffff';
	const secondaryColor = data.featured?.secondaryColor || '#000000';
</script>

<div
class="min-h-[100vh]"
	style="--primary-color: {primaryColor}; background-color: var(--primary-color); --secondary-color: {secondaryColor}; color: var(--secondary-color); --color-1: {secondaryColor}; --color-2: {secondaryColor};"
>
	<Header />
	{@render children()}
	<!-- <Footer /> -->
</div>
