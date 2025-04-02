<script>
	import CartContainer from '$lib/compontents/cart/cart-container.svelte';
	import Hero from '$lib/compontents/hero.svelte';

	const { data } = $props();
	const { featured } = data;
</script>

<svelte:head>
	<meta property="og:image" content="/images/og-image.png" />
</svelte:head>
<Hero {featured} />
<CartContainer />
