<script>
	import { collectCookies } from '$lib';
	import Header from '$lib/compontents/header.svelte';
	import cart from '$lib/stores/cart.svelte';
	import products from '$lib/stores/products.svelte';
	import user from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	let { data, children } = $props();

	onMount(() => {
		try {
			// FOR SOME REASON THIS FAILS IF THERE IS NO CART PREVIOUSLY OR SOMETHING
			const { cartSession } = collectCookies();
			if (cartSession) cart.set(cartSession);

			products.set(data.products);

			user.updateUser(data.user);
			user.updateToken(data.token);
		} catch (e) {
			alert(e);
		}
	});

	const primaryColor = data.featured?.theme.primaryColor || '#ffffff';
	const secondaryColor = data.featured?.theme.secondaryColor || '#000000';
	const thirdColor = data.featured?.theme.thirdColor || '#ffffff';

	let seo = data.featured?.seo || {
		title: 'Tickets',
		description: 'Tickets',
		image: '/images/og-image.png',
		host: 'https://tickets.yaytso.art/',
		icon: '/images/favicon.ico'
	};

	onMount(() => {
		document.body.style.backgroundColor = primaryColor;
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<!-- <meta property="og:image" content={seo.image} /> -->
	<!-- <meta property="og:url" content={'https://tickets.yaytso.art/' + eventName} /> -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="TIX" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<!-- <link rel="icon" type="image/x-icon" href={seo.host + seo.icon} /> -->
	<!-- <link rel="apple-touch-icon" href={seo.host + seo.icon} /> -->
</svelte:head>
<div
	style="--primary-color: {primaryColor}; background-color: var(--primary-color); --secondary-color: {secondaryColor}; --third-color: {thirdColor}; color: var(--secondary-color); --color-1: {secondaryColor}; --color-2: {secondaryColor};"
>
	<Header />
	{@render children()}
	<!-- <Footer /> -->
</div>
