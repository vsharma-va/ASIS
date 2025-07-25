<script>
	import Footer from '$lib/components/footer.svelte';
	import Landing from '$lib/components/Landing.svelte';
	import Partners from '$lib/components/Partners.svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';

	onMount(() => {
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
</script>

<svelte:head>
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
	</style>
</svelte:head>

<Landing />
<Partners />
<Footer />
