<script>
	import '../app.css';
	import { gsap } from 'gsap/dist/gsap';
	import Lenis from 'lenis';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		const lenis = new Lenis({
			autoRaf: true,
			lerp: 0.05
		});
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});
		gsap.ticker.lagSmoothing(0);
	});
</script>

{@render children()}
