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

	// ---- NAMES derived from watch.id (hyphens removed, words capitalized) ----
	let names = $derived(
		displayWatches.map(watch =>
			(watch.id || '')
				.split('-')
				.map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : '')
				.filter(Boolean)
				.join(' ')
		)
	);

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

		// Initialize carousel immediately (animations start when in view)
		initializeCarousel();

		// Report carousel as ready immediately after initialization
		setComponentReady('carousel', true);

		// Use Intersection Observer to control auto-rotation
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

		// Throttle drag updates with RAF
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
				// Don't update on every pixel; use RAF
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
	 * Optimized rendering: uses gsap.set for transform properties
	 */
	function updateCarouselState(newProgressValue) {
		const numCards = images.length;
		const half = numCards / 2;

		currentIndex = Math.round(newProgressValue) % numCards;
		if (currentIndex < 0) currentIndex += numCards;

		cards.forEach((card, i) => {
			let offset = i - newProgressValue;
			if (offset > half) offset -= numCards;
			if (offset < -half) offset += numCards;
			const absOffset = Math.abs(offset);

			const xPercent = offset * 100;
			const scale = 1 - absOffset * 0.2;
			const rotationY = -offset * 20;
			const opacity = absOffset > 2.5 ? 0 : 1;
			const zIndex = Math.round(numCards - absOffset);

			gsap.set(card, {
				xPercent,
				scale,
				rotationY,
				opacity,
				zIndex,
				force3D: true
			});
		});
	}

	/**
	 * Guarded animation to go to a card index
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
		if (!isInView) return;
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
	class="carousel-gallery relative w-full h-fit overflow-visible flex justify-center items-center pb-12"
>
	<div class="relative w-full h-[34rem]">
		<ul
			bind:this={cardsContainer}
			class="carousel-cards absolute w-[16.2rem] h-[25.2rem] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
		>
			{#each images as image, index}
				<!-- NOTE: keep the li structure intact; add Svelte class binding is-center -->
				<li
					class="carousel-card list-none p-0 m-0 w-full h-full absolute top-0 left-0 rounded-xl"
					class:is-center={currentIndex === index}
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
					<!-- Image / watch visual -->
					<div
						class="carousel-card-inner w-full h-full rounded-xl"
						style="background-image: url({image})"
						role="img"
						aria-label="Watch {index + 1} preview"
					></div>

					<!-- Title moved OUTSIDE the watch image for readability.
					     It still moves with the card (it's inside the li) but sits below the image.
					     pointer-events:none so it won't block drag or clicks. -->
					<div class="card-title {currentIndex === index ? 'active' : ''}">
						<div class="card-title-text">{names[index]}</div>
					</div>
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

	<div class="absolute bottom-14 left-1/2 transform -translate-x-1/2 flex gap-2.5">
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
		will-change: auto;
		overflow: visible; /* allow titles to be visible outside image bounds */
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
		overflow: visible; /* allow title overflow */
		transform: translateZ(0);
	}

	/* Keep the image centered; rotate(-90deg) remains as before */
	.carousel-card-inner {
		position: absolute;
		width: 25.2rem;
		height: 16.2rem;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-90deg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 0.75rem;
		will-change: auto;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
	}

	/* --- Title moved BELOW the image for readability --- */
	.card-title {
		position: absolute;
		bottom: -2.6rem;
		left: 50%;
		transform: translateX(-50%);

		width: 14.5rem;
		height: 3.6rem;

		padding: 0 1rem;

		color: white;

		background: rgba(0, 0, 0, 0.32);
		backdrop-filter: blur(6px);
		border-radius: 9999px;
		box-shadow: 0 10px 22px rgba(0, 0, 0, 0.15);

		display: flex;
		align-items: center; /* ⭐ TRUE vertical centering */
		justify-content: center; /* horizontal centering */

		pointer-events: none;
		z-index: 150;

		transition: opacity 0.28s ease,
		transform 0.28s cubic-bezier(.2, .9, .2, 1),
		background 0.28s ease,
		box-shadow 0.28s ease,
		color 0.28s ease;
	}

	.card-title-text {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; /* 1–2 lines allowed */
		overflow: hidden;
		text-align: center;

		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.2px;
		line-height: 1.15rem;
		white-space: normal;
		word-break: break-word;
		text-overflow: ellipsis;
	}

	/* Active (center) title: more prominent, brighter, subtle lift & pulse */
	.card-title.active {
		transform: translateX(-50%) translateY(-8px);
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03));
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
	}

	/* Gentle pulse for the active title — subtle, disabled for reduce-motion users */
	/* Pulse is small translation only (no scale) */
	@keyframes titlePulse {
		0% {
			transform: translateX(-50%) translateY(-8px);
		}
		50% {
			transform: translateX(-50%) translateY(-10px);
		}
		100% {
			transform: translateX(-50%) translateY(-8px);
		}
	}

	.card-title.active {
		animation: titlePulse 2.2s ease-in-out infinite;
		animation-delay: 0.15s;
	}

	/* Respect user motion preferences */
	@media (prefers-reduced-motion: reduce) {
		.card-title,
		.card-title.active {
			transition: none;
			animation: none;
			transform: translateX(-50%);
		}
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

	/* Reduce motion for users who prefer it */
	@media (prefers-reduced-motion: reduce) {
		.carousel-card {
			transition: none;
		}
	}
</style>
