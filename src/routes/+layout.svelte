<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';

	let { children } = $props();
	let smoother;

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
	}

	onMount(() => {
		// Explicitly define the wrapper and content for ScrollSmoother for stability
		smoother = ScrollSmoother.create({
			wrapper: '#smooth-wrapper',
			content: '#smooth-content',
			smooth: 2,
			smoothTouch: 0.5,
			ease: 'power',
			effects: true
		});

		return () => {
			smoother?.kill();
		};
	});
</script>

<!-- The Navbar is placed outside the scrolling area to keep it fixed -->
<Navbar />

<!-- These wrapper and content divs are for GSAP ScrollSmoother -->
<div id="smooth-wrapper">
	<div id="smooth-content">
		{@render children()}
	</div>
</div>
