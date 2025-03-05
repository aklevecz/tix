<script>
	import CartContainer from '$lib/compontents/cart/cart-container.svelte';
	import Hero from '$lib/compontents/hero.svelte';

	const { data } = $props();
	const { featured } = data;


</script>

<Hero {featured} />
<CartContainer />


