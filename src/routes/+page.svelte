<script>
	import Footer from '$lib/components/footer.svelte';
	import Landing from '$lib/components/Landing.svelte';
	import Partners from '$lib/components/Partners.svelte';
	import logoImg from '$lib/assets/images/AS IS.png';
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import Collections from '$lib/components/Collections.svelte';

	onMount(() => {
		// The carousel will register itself and report ready
		// No need to register the page separately since carousel handles it

		gsap.config({
			force3D: true,
			nullTargetWarn: false
		});
		if (typeof window !== 'undefined') {
			document.documentElement.style.scrollBehavior = 'auto';
			let ticking = false;
			const updateAnimations = () => {
				ticking = false;
			};
			const onScroll = () => {
				if (!ticking) {
					requestAnimationFrame(updateAnimations);
					ticking = true;
				}
			};
			const addTouchSupport = () => {
				document.addEventListener('touchstart', (e) => {
				}, { passive: true });
				document.addEventListener('touchmove', (e) => {
				}, { passive: true });
			};
			addTouchSupport();
			window.addEventListener('scroll', onScroll, { passive: true });
			return () => {
				window.removeEventListener('scroll', onScroll);
			};
		}
	});

	onDestroy(() => {
		// Cleanup handled by carousel
	});

</script>

<!-- Fixed Logo -->
<div class="fixed-logo">
	<img
		alt="ASIS Watches Logo"
		src={logoImg}
	/>
</div>

<div id="landing">

	<Landing />
</div>
<div id="collections">
	<Collections />
</div>
<Partners />
<div id="footer">

	<Footer />
</div>

<style>
	/* Global performance optimizations */
	* {
		backface-visibility: hidden;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* Optimize GPU layer creation */
	.primary-font, .secondary-font, .footer-font {
		transform: translateZ(0);
	}

	/* Prevent layout shifts during animations */
	img {
		transform: translateZ(0);
	}

	/* Optimize scroll performance */
	body {
		overflow-x: hidden;
	}

	/* Mobile-specific optimizations */
	@media (max-width: 768px) {
		* {
			/* Reduce motion on mobile for better performance */
			scroll-behavior: auto !important;
		}

		/* Optimize font rendering on mobile */
		body {
			-webkit-text-size-adjust: 100%;
			text-size-adjust: 100%;
		}
	}

	/* High DPI display optimizations */
	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		* {
			-webkit-font-smoothing: subpixel-antialiased;
		}
	}

	/* Landscape mobile optimization */
	@media (max-height: 500px) and (orientation: landscape) {
		.LandingSection {
			padding-top: 2%;
		}
	}

	/* Very small screen optimizations */
	@media (max-width: 320px) {
		.primary-font {
			font-size: 0.9em;
		}

		.secondary-font {
			font-size: 0.85em;
		}
	}

	/* Fixed logo styles */
	.fixed-logo {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 9999;
		pointer-events: auto;
		transform: translateZ(0);
		will-change: transform;
	}

	.fixed-logo img {
		width: 60px;
		height: auto;
		max-height: 60px;
		object-fit: contain;
		filter: brightness(0) saturate(100%) invert(78%) sepia(31%) saturate(466%) hue-rotate(142deg) brightness(95%) contrast(89%);
		transition: all 0.3s ease;
	}

	.fixed-logo:hover img {
		filter: brightness(0) saturate(100%) invert(78%) sepia(31%) saturate(466%) hue-rotate(142deg) brightness(110%) contrast(89%);
		transform: scale(1.05);
	}

	/* Responsive logo sizing */
	@media (max-width: 640px) {
		.fixed-logo {
			top: 15px;
			right: 15px;
		}

		.fixed-logo img {
			width: 45px;
			max-height: 45px;
		}
	}

	@media (max-width: 320px) {
		.fixed-logo {
			top: 12px;
			right: 12px;
		}

		.fixed-logo img {
			width: 35px;
			max-height: 35px;
		}
	}

	@media (min-width: 1024px) {
		.fixed-logo {
			top: 25px;
			right: 25px;
		}

		.fixed-logo img {
			width: 70px;
			max-height: 70px;
		}
	}

	@media (min-width: 1280px) {
		.fixed-logo {
			top: 30px;
			right: 30px;
		}

		.fixed-logo img {
			width: 80px;
			max-height: 80px;
		}
	}

	/* Ensure logo doesn't interfere with content */
	@media (max-height: 500px) and (orientation: landscape) {
		.fixed-logo {
			top: 10px;
			right: 15px;
		}

		.fixed-logo img {
			width: 40px;
			max-height: 40px;
		}
	}
</style>