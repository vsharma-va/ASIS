<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { gsap } from 'gsap';
	import ImageCarousel from '$lib/components/carousel.svelte';
	import { setComponentReady, registerComponent, unregisterComponent } from '$lib/stores/loadingStore';

	// Register this component immediately when script runs
	registerComponent('collections');

	// --- PROPS ---
	export let introData = {
		title: "Collections",
		description: "At AS - IS Watches, our collections are a tribute to individuality and artistry. Each line features meticulously crafted timepieces that showcase handpicked natural gemstones, ensuring that no two watches are alike. From elegant classics to bold statement pieces, our collections cater to every style and occasion. Discover the perfect watch that resonates with your essence, and wear a piece of art that tells your unique story. Embrace your individuality with every tick of an AS - IS watch."
	};

	// --- STATE & ANIMATION ---
	let introContainer;
	let hasAnimated = false;
	let observer;

	onMount(() => {
		if (!introContainer) {
			setComponentReady('collections', true);
			return;
		}

		// Check if element is already in viewport on mount
		const rect = introContainer.getBoundingClientRect();
		const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

		if (isInViewport) {
			// If already visible, animate immediately
			hasAnimated = true;
			animateIntro();
		} else {
			// Otherwise, wait for scroll into view
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && !hasAnimated) {
							hasAnimated = true;
							animateIntro();
						}
					});
				},
				{ threshold: 0.2, rootMargin: '0px' }
			);

			observer.observe(introContainer);

			// Still report as ready even if not animated yet
			// The component is loaded, just waiting for scroll
			setComponentReady('collections', true);
		}
	});

	function animateIntro() {
		gsap.from(introContainer.children, {
			duration: 1.2,
			y: 40,
			opacity: 0,
			stagger: 0.15,
			ease: 'power4.out',
			delay: 0.2,
			onComplete: () => {
				setComponentReady('collections', true);
			}
		});
	}

	onDestroy(() => {
		if (observer) observer.disconnect();
		gsap.killTweensOf(introContainer?.children);
		unregisterComponent('collections');
	});
</script>

<div class="intro-section h-fit flex items-center justify-center py-16" transition:fade>
	<div bind:this={introContainer} class="text-center max-w-3xl mx-auto px-6">
		<h1 class="primary-font text-6xl md:text-8xl text-zinc-900 mb-6">{introData.title}</h1>
		<p class="secondary-font text-zinc-600 leading-relaxed text-base md:text-lg mb-10">{introData.description}</p>
	</div>
</div>

<!-- Carousel Section -->
<div class="carousel-section">
	<ImageCarousel />
</div>