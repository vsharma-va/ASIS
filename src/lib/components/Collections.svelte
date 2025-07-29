<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { gsap } from 'gsap';


	// --- PROPS ---
	export let introData = {
		title: "Collections",
		description: "At AS-IS, we present a diverse range of curated collections highlighting our unique designs and craftsmanship. Each collection features stylish and unique timepieces, meticulously crafted with handpicked gemstones and exceptional artistry, ensuring that every piece stands out as a true expression of elegance and sophistication."
	};

	// --- STATE & ANIMATION ---
	let introContainer;

	onMount(() => {
		if (introContainer) {
			gsap.from(introContainer.children, {
				duration: 1.2,
				y: 40,
				opacity: 0,
				stagger: 0.15,
				ease: 'power4.out',
				delay: 0.2
			});
		}
	});
</script>

<div class="intro-section min-h-screen flex items-center justify-center" transition:fade>
	<div bind:this={introContainer} class="text-center max-w-3xl mx-auto px-6">
		<h1 class="primary-font text-6xl md:text-8xl text-zinc-900 mb-6">{introData.title}</h1>
		<p class="secondary-font text-zinc-600 leading-relaxed text-base md:text-lg mb-10">{introData.description}</p>
	</div>
</div>