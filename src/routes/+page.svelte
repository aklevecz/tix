<script>
	import CartContainer from '$lib/compontents/cart/cart-container.svelte';
	import Hero from '$lib/compontents/hero.svelte';
	import pricing from '$lib/stores/pricing.svelte.js';
	import { onMount } from 'svelte';

	const { data } = $props();
	const { featured } = data;

	let seo = featured?.seo || {
		title: 'Tickets',
		description: 'Tickets',
		image: '/images/og-image.png',
		host: 'https://tickets.yaytso.art/',
		icon: '/images/favicon.ico'
	};
	
	onMount(() => {
		pricing.startUpdates();
		return () => pricing.stopUpdates();
	});
</script>

<svelte:head>
	<meta property="og:image" content={seo.image} />
	<meta name="twitter:image" content={seo.image} />
</svelte:head>
<!-- <PriceVisualization/> -->
<Hero {featured} />

<CartContainer />
