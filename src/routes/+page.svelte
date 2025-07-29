<script>
	import Footer from '$lib/components/footer.svelte';
	import Landing from '$lib/components/Landing.svelte';
	import Partners from '$lib/components/Partners.svelte';
	import logoImg from "$lib/assets/images/AS IS.png";
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import Gallery from '$lib/components/Gallery.svelte';
	import Collections from '$lib/components/Collections.svelte';

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

	const petiteImageModules = import.meta.glob('$lib/assets/images/watchFaces/invisible_petite*.{jpg,jpeg,png,webp}', {
		eager: true
	});
	const petiteImageSlides = Object.entries(petiteImageModules).map(([path, module]) => ({
		id: path, // Use the file path as a unique ID
		imageUrl: module.default
	}));

	const doubleRainbowImageModules = import.meta.glob('$lib/assets/images/watchFaces/twin_rainbow*.{jpg,jpeg,png,webp}', {
		eager: true
	});
	const doubleRainbowSlides = Object.entries(doubleRainbowImageModules).map(([path, module]) => ({
		id: path,
		imageUrl: module.default
	}));

	const blackPantherImageModules = import.meta.glob('$lib/assets/images/watchFaces/black_panther*.{jpg,jpeg,png,webp}', {
		eager: true
	});
	const blackPantherSlides = Object.entries(blackPantherImageModules).map(([path, module]) => ({
		id: path,
		imageUrl: module.default
	}));

	let petiteGalleryData = {
		collection: "Petite",
		subCollection: "The Invisible",
		title: "A Gemstone Symphony",
		watchDescription: "A Gemstone Symphony Crafted in the Art of Invisible Setting Watch",
		specs: [
			{ label: "Model NO", value: "M1881S" },
			{ label: "Case Size", value: "33 MM" },
			{ label: "Leather Options", value: "Alligator / Vegan" },
			{ label: "Variants", value: "9 Variants" }
		],
		gemstones: ["Diamond", "Colored Sapphire", "Tsavorite", "Iolite", "Amethyst", "Ruby", "Emerald", "Topaz"],
		slides: petiteImageSlides
	};

	let doubleRainbowGalleryData = {
		collection: "The Twin-Rainbow",
		subCollection: "The Twin-Rainbow",
		title: "A Gemstone Symphony",
		watchDescription: "A Colorful Spectrum Capturing the Rare Essence of a Twin Rainbow Watch",
		specs: [
			{ label: "Model NO", value: "M1308S Rainbow" },
			{ label: "Case Size", value: "38 MM" },
			{ label: "Leather Options", value: "Alligator / Vegan" },
			{ label: "Variants", value: "7 Variants" }
		],
		gemstones: ["Diamond", "Colored Sapphire"],
		slides: doubleRainbowSlides // Dynamically loaded images are assigned here
	}

	let blackPantherGalleryData = {
		collection: "Petite",
		subCollection: "The Black Panther",
		title: "A Gemstone Symphony",
		watchDescription: "A Spirit of the Wild Manifested in a Black Panther Watch",
		specs: [
			{ label: "Model NO", value: "M1308S Black Panther" },
			{ label: "Case Size", value: "38 MM" },
			{ label: "Leather Options", value: "Alligator / Vegan" },
			{ label: "Variants", value: "2 Variants" }
		],
		gemstones: ["Diamond", "Tsavorite"],
		slides: blackPantherSlides // Dynamically loaded images are assigned here
	}

</script>

<!-- Fixed Logo -->
<div class="fixed-logo">
	<img
		src={logoImg}
		alt="ASIS Watches Logo"
	/>
</div>

<Landing />
<Collections/>
<Gallery galleryData="{petiteGalleryData}"/>
<Gallery galleryData="{doubleRainbowGalleryData}"/>
<Gallery galleryData="{blackPantherGalleryData}"/>
<Partners />
<Footer />

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


