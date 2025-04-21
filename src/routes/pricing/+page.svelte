<script>
	import PriceVisualization from '$lib/compontents/price-visualization.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<PriceVisualization />
