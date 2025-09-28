<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { Draggable } from 'gsap/dist/Draggable';
	import { InertiaPlugin } from "gsap/dist/InertiaPlugin";
	import { goto } from '$app/navigation';
	import { getAllWatchIds } from '$lib/stores/watchData.js';

	// Register GSAP plugins
	gsap.registerPlugin(InertiaPlugin,Draggable);

	// --- PROPS ---
	export let images = [
		'https://assets.codepen.io/16327/portrait-number-01.png',
		'https://assets.codepen.io/16327/portrait-number-02.png',
		'https://assets.codepen.io/16327/portrait-number-03.png',
		'https://assets.codepen.io/16327/portrait-number-04.png',
		'https://assets.codepen.io/16327/portrait-number-05.png',
		'https://assets.codepen.io/16327/portrait-number-06.png',
		'https://assets.codepen.io/16327/portrait-number-07.png',
		'https://assets.codepen.io/16327/portrait-number-01.png',
		'https://assets.codepen.io/16327/portrait-number-02.png',
		'https://assets.codepen.io/16327/portrait-number-03.png',
		'https://assets.codepen.io/16327/portrait-number-04.png',
		'https://assets.codepen.io/16327/portrait-number-05.png',
		'https://assets.codepen.io/16327/portrait-number-06.png',
		'https://assets.codepen.io/16327/portrait-number-07.png',
		'https://assets.codepen.io/16327/portrait-number-01.png',
		'https://assets.codepen.io/16327/portrait-number-02.png',
		'https://assets.codepen.io/16327/portrait-number-03.png',
		'https://assets.codepen.io/16327/portrait-number-04.png',
		'https://assets.codepen.io/16327/portrait-number-05.png',
		'https://assets.codepen.io/16327/portrait-number-06.png',
		'https://assets.codepen.io/16327/portrait-number-07.png',
	];

	// --- STATE ---
	let galleryContainer;
	let cardsContainer;
	let dragProxy;
	let nextBtn;
	let prevBtn;

	// A proxy object to represent the carousel's continuous progress
	let progress = { value: 0 };

	let currentIndex = 0;
	let isAnimating = false;
	let draggableInstance;
	let autoRotateTimer;
	let cards;

	// Get watch IDs for navigation
	const watchIds = getAllWatchIds();

	// --- CLICK HANDLER FOR WATCH NAVIGATION ---
	function handleWatchClick(index) {
		// Only navigate if we're not currently dragging
		if (!draggableInstance || !draggableInstance.isDragging) {
			console.log(watchIds);
			console.log(index);
			const watchId = watchIds[index];
			if (watchId) {
				goto(`/watches/${watchId}`);
			}
		}
	}

	// --- LIFECYCLE ---
	onMount(() => {
		if (!galleryContainer || !cardsContainer) return;
		cards = gsap.utils.toArray('.carousel-card');
		initializeCarousel();
	});

	onDestroy(() => {
		if (draggableInstance) draggableInstance.kill();
		if (autoRotateTimer) clearInterval(autoRotateTimer);
		gsap.killTweensOf([cards, progress]);
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
			type: "x",
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
				const velocity = InertiaPlugin.getVelocity(this.target, "x");
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
				duration: 0.5, // No duration for instant updates
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
			ease: "power2.inOut",
			onUpdate: () => updateCarouselState(progress.value), // The onUpdate call renders the animation
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
					class="carousel-card list-none p-0 m-0 w-full h-full absolute top-0 left-0 rounded-xl bg-cover bg-no-repeat bg-center"
					style="background-image: url({image})"
					on:click={() => handleWatchClick(index)}
					on:keydown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							handleWatchClick(index);
					}}}
					role="button"
					tabindex="0"
					aria-label="View Details for watch {index + 1}"
				></li>
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
		perspective: 1500px; /* Increased perspective for larger size */
		transform-style: preserve-3d;
		will-change: transform;
	}
	.carousel-card {
		transform-style: preserve-3d;
		will-change: transform, opacity;
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5); /* Enhanced shadow for depth */
	}
	.drag-proxy:active {
		cursor: grabbing;
	}

	/* CHANGE 2: Styling for new arrow buttons */
	.arrow-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 3rem; /* 48px */
		height: 3rem; /* 48px */
		border-radius: 9999px; /* rounded-full */
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
		width: 1.75rem; /* 28px */
		height: 1.75rem; /* 28px */
	}
</style>