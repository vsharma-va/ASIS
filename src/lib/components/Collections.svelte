<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { gsap } from 'gsap';
	import ImageCarousel from '$lib/components/carousel.svelte';

	// --- PROPS ---
	export let introData = {
		title: "Collections",
		description: "At AS - IS Watches, our collections are a tribute to individuality and artistry. Each line features meticulously crafted timepieces that showcase handpicked natural gemstones, ensuring that no two watches are alike. From elegant classics to bold statement pieces, our collections cater to every style and occasion. Discover the perfect watch that resonates with your essence, and wear a piece of art that tells your unique story. Embrace your individuality with every tick of an AS - IS watch."
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

<div class="intro-section h-fit flex items-center justify-center" transition:fade>
	<div bind:this={introContainer} class="text-center max-w-3xl mx-auto px-6">
		<h1 class="primary-font text-6xl md:text-8xl text-zinc-900 mb-6">{introData.title}</h1>
		<p class="secondary-font text-zinc-600 leading-relaxed text-base md:text-lg mb-10">{introData.description}</p>
	</div>
</div>

<!-- Carousel Section -->
<div class="carousel-section">
	<ImageCarousel />
</div>