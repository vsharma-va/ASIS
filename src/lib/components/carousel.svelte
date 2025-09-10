<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { Draggable } from 'gsap/dist/Draggable';
	import { InertiaPlugin } from "gsap/dist/InertiaPlugin";

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

	let currentIndex = 0;
	let isAnimating = false;
	let draggableInstance;
	let autoRotateTimer;
	let cards;

	// --- LIFECYCLE ---
	onMount(() => {
		if (!galleryContainer || !cardsContainer) return;
		cards = gsap.utils.toArray('.carousel-card');
		initializeCarousel();
	});

	onDestroy(() => {
		// Clean up GSAP instances and timers
		if (draggableInstance) draggableInstance.kill();
		if (autoRotateTimer) clearInterval(autoRotateTimer);
		gsap.killTweensOf(cards);
	});

	// --- FUNCTIONS ---
	function initializeCarousel() {
		updateCarouselState(0, 0);

		const handleNext = () => gotoCard((currentIndex + 1) % images.length);
		const handlePrev = () => gotoCard((currentIndex - 1 + images.length) % images.length);

		nextBtn.addEventListener('click', handleNext);
		prevBtn.addEventListener('click', handlePrev);

		// CHANGE 1: Draggable with inertia
		draggableInstance = Draggable.create(dragProxy, {
			type: "x",
			trigger: cardsContainer,
			inertia: true,
			onDragStart: () => {
				stopAutoRotate(); // Pause rotation on user interaction
			},
			onDragEnd: function() {
				startAutoRotate();
				const velocity = InertiaPlugin.getVelocity(this.target,"x") / 10
				const threshold = 250; // Velocity needed for a "flick"
				let change = 0;
				console.log(velocity);
				if (Math.abs(velocity) > threshold) {
					// Faster flick moves more cards
					change = Math.round(velocity / 8);
				} else {
					// Slow drag moves just one card
					const dragDistance = this.endX - this.startX;
					if (Math.abs(dragDistance) > 50) { // Drag threshold
						change = dragDistance < 0 ? 1 : -1;
					}
				}

				if (change !== 0) {
					let newIndex = currentIndex + change;
					// Wrap index around
					gotoCard((newIndex % images.length + images.length) % images.length);
				}
			}
		})[0];

		startAutoRotate();

		onDestroy(() => {
			nextBtn?.removeEventListener('click', handleNext);
			prevBtn?.removeEventListener('click', handlePrev);
		});
	}

	function updateCarouselState(newIndex, duration = 0.6) {
		if (isAnimating && duration > 0) return;
		if (duration > 0) isAnimating = true;

		currentIndex = newIndex;
		const numCards = images.length;
		const half = numCards / 2;

		cards.forEach((card, i) => {
			let offset = i - currentIndex;
			if (offset > half) offset -= numCards;
			if (offset < -half) offset += numCards;
			const absOffset = Math.abs(offset);

			const properties = {
				// CHANGE 4: Increased spacing multiplier to 100
				xPercent: offset * 100,
				scale: 1 - absOffset * 0.2,
				rotationY: -offset * 20,
				zIndex: numCards - absOffset,
				opacity: absOffset > 2 ? 0 : 1,
				duration: duration,
				ease: "power2.inOut",
				overwrite: "auto",
			};
			gsap.to(card, properties);
		});

		if (duration > 0) {
			gsap.delayedCall(duration, () => { isAnimating = false; });
		}
	}

	function gotoCard(index) {
		if (index === currentIndex && isAnimating) return;
		// stopAutoRotate();
		updateCarouselState(index);
	}

	function startAutoRotate() {
		// stopAutoRotate();
		autoRotateTimer = setInterval(() => {
			gotoCard((currentIndex + 1) % images.length);
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
			{#each images as image}
				<li
					class="carousel-card list-none p-0 m-0 w-full h-full absolute top-0 left-0 rounded-xl bg-cover bg-no-repeat bg-center"
					style="background-image: url({image})"
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