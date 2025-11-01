<!-- Carousel component with GSAP and Draggable.js -->
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

	// Get watch IDs for navigation

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
		;
		cards = gsap.utils.toArray('.carousel-card');
		initializeCarousel();
		// Report carousel as ready after initialization
		setComponentReady('carousel', true);
	});

	onDestroy(() => {
		if (draggableInstance) draggableInstance.kill();
		if (autoRotateTimer) clearInterval(autoRotateTimer);
		gsap.killTweensOf([cards, progress]);
		// Unregister component when destroyed
		unregisterComponent('carousel');
	});

	// --- FUNCTIONS ---
	function initializeCarousel() {
		updateCarouselState(0);

		const handleNext = () => gotoCard(Math.round(progress.value + 1));
		const handlePrev = () => gotoCard(Math.round(progress.value - 1));

		nextBtn.addEventListener('click', handleNext);
		prevBtn.addEventListener('click', handlePrev);

		// The new, real-time draggable implementation
		draggableInstance = Draggable.create(dragProxy, {
			type: 'x',
			trigger: cardsContainer,
			inertia: true,
			onPress() {
				stopAutoRotate();
				// Kill any ongoing animations and sync the progress value
				gsap.killTweensOf(progress);
				this.startProgress = progress.value;
			},
			onDrag() {
				// Calculate the new progress value based on drag distance
				const sensitivity = 0.005; // Adjust this for drag "speed"
				progress.value = this.startProgress - (this.x - this.startX) * sensitivity;
				// Update the carousel visuals in real-time
				updateCarouselState(progress.value);
			},
			onDragEnd() {
				// Use inertia to project the final landing position
				const velocity = InertiaPlugin.getVelocity(this.target, 'x');
				const projectedProgress = progress.value - (velocity * 0.0002); // Inertia sensitivity

				// Snap to the nearest whole number (the closest card)
				let finalIndex = Math.round(projectedProgress);

				// Animate smoothly to the final snapped position
				gotoCard(finalIndex);
				startAutoRotate();
			}
		})[0];

		startAutoRotate();

		onDestroy(() => {
			nextBtn?.removeEventListener('click', handleNext);
			prevBtn?.removeEventListener('click', handlePrev);
		});
	}

	/**
	 * This function is now the "renderer". It positions cards based on a
	 * continuous progress value, which can be a fraction for in-between states.
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

			const properties = {
				xPercent: offset * 100,
				scale: 1 - absOffset * 0.2,
				rotationY: -offset * 20,
				zIndex: numCards - absOffset,
				opacity: absOffset > 2.5 ? 0 : 1, // Hide cards a bit further away
				duration: 0.5 // No duration for instant updates
			};
			gsap.set(card, properties); // Use gsap.set for better performance on rapid updates
		});
	}

	/**
	 * This function handles discrete jumps, like clicking a button or snapping
	 * after a drag. It smoothly animates the progress value.
	 */
	function gotoCard(index) {
		// Wrap index for infinite loop
		const wrappedIndex = (index % images.length + images.length) % images.length;

		gsap.to(progress, {
			value: wrappedIndex,
			duration: 0.8,
			ease: 'power2.inOut',
			onUpdate: () => updateCarouselState(progress.value) // The onUpdate call renders the animation
		});
	}

	function startAutoRotate() {
		stopAutoRotate();
		autoRotateTimer = setInterval(() => {
			gotoCard(Math.round(progress.value + 1));
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
			{#each images as image,index}
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
					<div class="carousel-card-inner w-full h-full rounded-xl"
						 style="background-image: url({image})"></div>
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
	}

	.carousel-cards {
		perspective: 1500px;
		transform-style: preserve-3d;
		will-change: transform;
	}

	.carousel-card {
		transform-style: preserve-3d;
		will-change: transform, opacity;
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
		overflow: hidden;
	}

	.carousel-card-inner {
		/* * We remove 'w-full', 'h-full', and 'inset: 0' and
		 * set explicit swapped dimensions.
		 * The parent card is w-72 (18rem) by h-[28rem].
		 * We make this element w-[28rem] by h-[18rem] (h-72).
		*/
		position: absolute;
		width: 28rem;
		height: 18rem; /* 18rem is 72px, or h-72 in Tailwind */

		/* Center this new landscape element inside its portrait parent */
		top: 50%;
		left: 50%;

		/* * Now we center AND rotate.
		 * The 'scale(1.4)' is removed because it was fighting the
		 * old, incorrect layout. It's no longer needed to "fit" the image.
		*/
		transform: translate(-50%, -50%) rotate(-90deg);

		/* These background properties will now work perfectly */
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		/* Keep the styles from your original rule */
		border-radius: 0.75rem;
		will-change: transform;
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
		color: white;
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
</style>