<script>
	import { page } from '$app/stores';
	const what = [
		'what?',
		'huh?',
		'sorry?',
		'excuse me?',
		'pardon?',
		'say again?',
		'can you repeat that?',
		'can you clarify?',
		'can you explain?',
		"I don't understand",
		"I'm confused",
		"that doesn't make sense",
		"I'm lost",
		"I'm not sure I follow",
		"I'm not getting it",
		"I'm not comprehending"
	];
	const randomIndex = Math.floor(Math.random() * what.length);
</script>

<div class="min-h-[80vh] flex items-center justify-center  text-white"> 
	<h1 class="text-center text-3xl">{what[randomIndex]}</h1>
</div>
<!-- <h1>{$page.status}: {$page.error.message}</h1> -->
