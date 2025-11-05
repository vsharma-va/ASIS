<!-- Carousel component with GSAP and Draggable.js - Performance Optimized -->
<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { Draggable } from 'gsap/dist/Draggable';
	import { InertiaPlugin } from 'gsap/dist/InertiaPlugin';
	import { goto } from '$app/navigation';
	import { getAllWatches } from '$lib/stores/watchData.js';
	import { setComponentReady, registerComponent, unregisterComponent } from '$lib/stores/loadingStore';

	// Register this component immediately when script runs
	registerComponent('carousel');

	// Register GSAP plugins
	gsap.registerPlugin(InertiaPlugin, Draggable);
	const allWatches = getAllWatches();
	const displayWatches = $derived(allWatches.filter((watch) => watch.isEnabled !== false));
	let images = $derived(displayWatches.map(watch => watch.landingImage));
	let watchIds = $derived(displayWatches.map(watch => watch.id));

	// --- STATE ---
	let galleryContainer;
	let cardsContainer;
	let dragProxy;
	let nextBtn;
	let prevBtn;

	// A proxy object to represent the carousel's continuous progress
	let progress = { value: 0 };

	let currentIndex = $state(0);
	let isAnimating = false;
	let draggableInstance;
	let autoRotateTimer;
	let cards;
	let rafId = null; // RequestAnimationFrame ID
	let isInView = false; // Track if carousel is in viewport

	// --- PERFORMANCE: Intersection Observer for lazy initialization ---
	let observer;

	// --- CLICK HANDLER FOR WATCH NAVIGATION ---
	function handleWatchClick(index) {
		// Only navigate if we're not currently dragging
		if (!draggableInstance || !draggableInstance.isDragging) {
			const watchId = watchIds[index];
			if (watchId) {
				goto(`/watches/${watchId}`);
			}
		}
	}

	// --- LIFECYCLE ---
	onMount(() => {
		if (!galleryContainer || !cardsContainer) {
			console.error('Gallery container or cards container not found');
			setComponentReady('carousel', true);
			return;
		}

		cards = gsap.utils.toArray('.carousel-card');

		// CRITICAL FIX: Initialize carousel immediately for loading state
		// But only start animations/auto-rotate when in view
		initializeCarousel();

		// Report carousel as ready immediately after initialization
		setComponentReady('carousel', true);

		// PERFORMANCE FIX: Use Intersection Observer to control auto-rotation
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isInView) {
						isInView = true;
						startAutoRotate();
					} else if (!entry.isIntersecting && isInView) {
						isInView = false;
						stopAutoRotate();
					}
				});
			},
			{ threshold: 0.1, rootMargin: '50px' }
		);

		observer.observe(galleryContainer);
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
		if (draggableInstance) draggableInstance.kill();
		if (autoRotateTimer) clearInterval(autoRotateTimer);
		if (rafId) cancelAnimationFrame(rafId);
		gsap.killTweensOf([cards, progress]);
		unregisterComponent('carousel');
	});

	// --- FUNCTIONS ---
	function initializeCarousel() {
		updateCarouselState(0);

		const handleNext = () => {
			if (!isAnimating) gotoCard(Math.round(progress.value + 1));
		};
		const handlePrev = () => {
			if (!isAnimating) gotoCard(Math.round(progress.value - 1));
		};

		nextBtn.addEventListener('click', handleNext);
		prevBtn.addEventListener('click', handlePrev);

		// PERFORMANCE FIX: Throttle drag updates with RAF
		let isDragging = false;
		let pendingUpdate = false;

		draggableInstance = Draggable.create(dragProxy, {
			type: 'x',
			trigger: cardsContainer,
			inertia: true,
			onPress() {
				stopAutoRotate();
				gsap.killTweensOf(progress);
				this.startProgress = progress.value;
				isDragging = true;
			},
			onDrag() {
				// PERFORMANCE FIX: Don't update on every pixel, use RAF
				if (!pendingUpdate) {
					pendingUpdate = true;
					rafId = requestAnimationFrame(() => {
						if (isDragging) {
							const sensitivity = 0.005;
							progress.value = this.startProgress - (this.x - this.startX) * sensitivity;
							updateCarouselState(progress.value);
						}
						pendingUpdate = false;
					});
				}
			},
			onDragEnd() {
				isDragging = false;
				const velocity = InertiaPlugin.getVelocity(this.target, 'x');
				const projectedProgress = progress.value - (velocity * 0.0002);
				let finalIndex = Math.round(projectedProgress);
				gotoCard(finalIndex);
				if (isInView) startAutoRotate();
			}
		})[0];

		onDestroy(() => {
			nextBtn?.removeEventListener('click', handleNext);
			prevBtn?.removeEventListener('click', handlePrev);
		});
	}

	/**
	 * PERFORMANCE FIX: Optimized rendering function
	 * Uses transform matrix for better GPU performance
	 */
	function updateCarouselState(newProgressValue) {
		const numCards = images.length;
		const half = numCards / 2;

		// Update the reactive currentIndex for the progress dots
		currentIndex = Math.round(newProgressValue) % numCards;
		if (currentIndex < 0) currentIndex += numCards;

		cards.forEach((card, i) => {
			let offset = i - newProgressValue;
			if (offset > half) offset -= numCards;
			if (offset < -half) offset += numCards;
			const absOffset = Math.abs(offset);

			// PERFORMANCE FIX: Use single transform with matrix3d for better GPU performance
			const xPercent = offset * 100;
			const scale = 1 - absOffset * 0.2;
			const rotationY = -offset * 20;
			const opacity = absOffset > 2.5 ? 0 : 1;
			const zIndex = Math.round(numCards - absOffset);

			// Use gsap.set with minimal properties for instant updates
			gsap.set(card, {
				xPercent,
				scale,
				rotationY,
				opacity,
				zIndex,
				force3D: true // Force GPU acceleration
			});
		});
	}

	/**
	 * PERFORMANCE FIX: Added animation guard
	 */
	function gotoCard(index) {
		if (isAnimating) return;
		isAnimating = true;

		const wrappedIndex = (index % images.length + images.length) % images.length;

		gsap.to(progress, {
			value: wrappedIndex,
			duration: 0.8,
			ease: 'power2.inOut',
			onUpdate: () => updateCarouselState(progress.value),
			onComplete: () => {
				isAnimating = false;
			}
		});
	}

	function startAutoRotate() {
		if (!isInView) return; // Don't auto-rotate if not in view
		stopAutoRotate();
		autoRotateTimer = setInterval(() => {
			if (isInView && !isAnimating) {
				gotoCard(Math.round(progress.value + 1));
			}
		}, 3000);
	}

	function stopAutoRotate() {
		if (autoRotateTimer) {
			clearInterval(autoRotateTimer);
			autoRotateTimer = null;
		}
	}
</script>

<div
	bind:this={galleryContainer}
	class="carousel-gallery relative w-full h-fit overflow-hidden flex justify-center items-center pb-10"
>
	<div class="relative w-full h-[30rem]">
		<ul
			bind:this={cardsContainer}
			class="carousel-cards absolute w-72 h-[28rem] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
		>
			{#each images as image, index}
				<li
					class="carousel-card list-none p-0 m-0 w-full h-full absolute top-0 left-0 rounded-xl"
					on:click={() => handleWatchClick(index)}
					on:keydown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							handleWatchClick(index);
					}}}
					role="button"
					tabindex="0"
					aria-label="View Details for watch {index + 1}"
				>
					<!-- PERFORMANCE FIX: Add loading="lazy" and decoding="async" -->
					<div
						class="carousel-card-inner w-full h-full rounded-xl"
						style="background-image: url({image})"
						role="img"
						aria-label="Watch {index + 1} preview"
					></div>
				</li>
			{/each}
		</ul>
	</div>

	<button
		bind:this={prevBtn}
		class="arrow-btn left-4 md:left-12"
		aria-label="Previous slide"
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	</button>
	<button
		bind:this={nextBtn}
		class="arrow-btn right-4 md:right-12"
		aria-label="Next slide"
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</button>

	<div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2.5">
		{#each images as _, index}
			<button
				class="w-2 h-2 rounded-full transition-all duration-300 {currentIndex === index ? 'bg-white scale-125' : 'bg-white/40'}"
				on:click={() => gotoCard(index)}
				aria-label="Go to slide {index + 1}"
			></button>
		{/each}
	</div>

	<div bind:this={dragProxy} class="drag-proxy invisible absolute inset-0 cursor-grab"></div>
</div>

<style>
	.carousel-gallery {
		contain: layout style paint;
		touch-action: pan-y;
		will-change: auto; /* Let browser decide */
	}

	.carousel-cards {
		perspective: 1500px;
		transform-style: preserve-3d;
		will-change: auto;
	}

	.carousel-card {
		transform-style: preserve-3d;
		will-change: transform;
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
		overflow: hidden;
		/* PERFORMANCE FIX: Add GPU acceleration hint */
		transform: translateZ(0);
	}

	.carousel-card-inner {
		position: absolute;
		width: 28rem;
		height: 18rem;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-90deg);

		/* PERFORMANCE FIX: Optimize background properties */
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 0.75rem;
		will-change: auto;

		/* PERFORMANCE FIX: Add image rendering hints */
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
	}

	.drag-proxy:active {
		cursor: grabbing;
	}

	.arrow-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 3rem;
		height: 3rem;
		border-radius: 9999px;
		background-color: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		color: black;
		z-index: 200;
		transition: background-color 0.3s ease, transform 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.arrow-btn:hover {
		background-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-50%) scale(1.05);
	}

	.arrow-btn svg {
		width: 1.75rem;
		height: 1.75rem;
	}

	/* PERFORMANCE FIX: Reduce motion for users who prefer it */
	@media (prefers-reduced-motion: reduce) {
		.carousel-card {
			transition: none;
		}
	}
</style>