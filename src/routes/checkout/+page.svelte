<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<div class="bg-[#121212] p-8">
	<a
		href="/checkout/pay"
		class="block w-full bg-[var(--red)] p-3 text-center text-base font-bold text-white
           transition-colors duration-200 hover:bg-[var(--yellow)]"
	>
		CONTINUE
	</a>
</div>
