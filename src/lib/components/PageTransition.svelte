<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { isLoading, startNavigation, completeNavigation, resetLoading } from '$lib/stores/loadingStore';

	let transitionEl;
	let isTransitioning = false;
	let unsubscribe = null;

	onMount(() => {
		// Initialize the transition element off-screen (to the right)
		gsap.set(transitionEl, { xPercent: 100 });

		return () => {
			// Cleanup subscription on unmount
			if (unsubscribe) unsubscribe();
		};
	});

	beforeNavigate(async () => {
		if (isTransitioning) return;

		isTransitioning = true;

		// Signal that navigation is starting
		startNavigation();

		// Reset the loading state for the new page
		resetLoading();

		// Slide the transition overlay in from right to left (covers current page)
		await gsap.to(transitionEl, {
			xPercent: 0,
			duration: 0.5,
			ease: 'power2.inOut'
		});
	});

	afterNavigate(() => {
		// Cleanup previous subscription if exists
		if (unsubscribe) unsubscribe();

		// Signal that navigation has completed (DOM is ready)
		setTimeout(() => {
			completeNavigation();
		}, 50);

		// Wait for loading to complete before sliding out
		unsubscribe = isLoading.subscribe(loading => {
			if (!loading && isTransitioning) {
				// Delay to ensure loader has completely faded out
				setTimeout(() => {
					// All components are ready, slide the transition overlay out to the left
					gsap.to(transitionEl, {
						xPercent: -100,
						duration: 0.5,
						ease: 'power2.inOut',
						onComplete: () => {
							// Reset to right side for next transition
							gsap.set(transitionEl, { xPercent: 100 });
							isTransitioning = false;
						}
					});
				}, 400); // Wait for loader fade out (300ms) + small buffer

				// Unsubscribe after handling
				if (unsubscribe) {
					unsubscribe();
					unsubscribe = null;
				}
			}
		});
	});
</script>

<div
	bind:this={transitionEl}
	class="page-transition"
	aria-hidden="true"
>
	<div class="transition-content">
		<!-- Optional: Add a subtle animation or logo here -->
	</div>
</div>

<style>
	.page-transition {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #ffffff; /* White background to match loader */
		z-index: 9998; /* Below loader so loader shows on top during loading */
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.transition-content {
		/* Optional styling for content inside transition */
	}
</style>