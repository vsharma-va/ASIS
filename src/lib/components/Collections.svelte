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
		title: 'Collections',
		description: ''
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

<div class="intro-section h-fit flex flex-col items-center justify-center py-16" transition:fade>
	<div bind:this={introContainer} class="text-center max-w-4xl mx-auto">
		<h1 class="primary-font text-6xl md:text-7xl text-zinc-900 mb-3">{introData.title}</h1>
	</div>
	<a
		href="/collections"
		class="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-black text-white
    				rounded-full hover:bg-gray-800 transition-all duration-300
    				hover:gap-3 group shadow-lg hover:shadow-xl">
		<span class="text-sm sm:text-base font-medium">Explore Our Collections</span>
		<svg
			class="arrow-icon w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24">
			<path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
		</svg>
	</a>
</div>

<!-- Carousel Section -->
<div class="carousel-section -mt-[5rem]">
	<ImageCarousel />
</div>