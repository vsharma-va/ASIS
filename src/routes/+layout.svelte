<script>
	import '../app.css';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';

	let { children } = $props();
	let smoother;

	if(typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger,ScrollSmoother);
	}

	onMount(() => {
		smoother = ScrollSmoother.create({
			// speed: 0.9,
			smooth: 2,
			smoothTouch: 0.5,
			ease: "power",
			effects: true,
		})
	});
	console.log(smoother);
</script>
<div id="smooth-content">
{@render children()}
</div>