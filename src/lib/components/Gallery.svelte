<!--
  AestheticGallery.svelte

  This is a modular and responsive gallery component for SvelteKit.
  It uses Swiper.js for the carousel and GSAP for text animations, styled for a luxurious aesthetic.

  HOW TO USE:
  1. Install dependencies:
     npm install swiper gsap

  2. CRITICAL: Place your images in the `src/lib/assets/images/` directory.
     The component will ONLY find images that are in this exact folder.

  3. CRITICAL: Name your image files so they start with 'invisible_petite'.
     For example: 'invisible_petite-01.jpg', 'invisible_petite-watch.png', etc.
     The dynamic import depends on this naming convention.

  4. Ensure your global CSS defines `.bg-gradient`, `.primary-font`, and `.secondary-font`.

  5. Import this component into your page:
     import AestheticGallery from './path/to/AestheticGallery.svelte';

  6. Pass your watch-specific data as a prop:
     <AestheticGallery galleryData={myWatchData} />
-->
<script>
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Navigation, EffectFade, Controller } from 'swiper/modules';
	import 'swiper/css';
	import 'swiper/css/effect-fade';

	import { gsap } from 'gsap';

	// PROPS: The component accepts a single object with all gallery data.
	let {galleryData} = $props();

	let currentIndex = $state(0);
	let swiperInstance = null;
	let infoContainer; // Will bind to the info container div

	onMount(() => {
		if (galleryData.slides.length === 0) {
			console.warn("No images found for the gallery. Make sure your images are in 'src/lib/assets/images' and named correctly.");
			return;
		}

		swiperInstance = new Swiper('.swiper-container', {
			modules: [Navigation, EffectFade, Controller],
			effect: 'fade',
			fadeEffect: { crossFade: false },
			speed: 1200,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		});

		animateInfoIn();
	});

	function animateInfoIn() {
		if (!infoContainer) return;

		const tl = gsap.timeline();
		tl.fromTo(infoContainer.children,
			{ y: 35, opacity: 0 },
			{
				duration: 1,
				y: 0,
				opacity: 1,
				stagger: 0.12,
				ease: 'power4.out'
			}
		);
	}

</script>

<div class="gallery-wrapper bg-gradient text-zinc-800 min-h-screen w-full" id="gallery">
	<!-- Gallery Section for a specific watch -->
	<div class="gallery-container w-full flex flex-col lg:flex-row border-t border-zinc-200">

		<!-- Right Panel: Image Carousel -->
		<div class="w-full lg:w-7/12 h-[70vh] lg:h-screen order-1">
			{#if galleryData.slides.length > 0}
				<div class="swiper-container h-full w-full">
					<div class="swiper-wrapper">
						{#each galleryData.slides as slide, i}
							<div class="swiper-slide" data-swiper-slide-index={i}>
								<img src={slide.imageUrl} alt="Gallery image {i + 1} for {galleryData.subCollection}" class="w-full h-full object-contain">
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="h-full w-full flex items-center justify-center">
					<p class="secondary-font text-zinc-500">Coming Soon!</p>
				</div>
			{/if}
		</div>

		<!-- Mobile-Only Navigation -->
		{#if galleryData.slides.length > 0}
			<div class="w-full lg:hidden flex justify-center items-center space-x-6 order-2 p-4 border-b border-zinc-200">
				<button class="swiper-button-prev p-3 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors duration-300">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
				</button>
				<button class="swiper-button-next p-3 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors duration-300">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
				</button>
			</div>
		{/if}

		<!-- Left Panel: Project Information & Navigation -->
		<div class="w-full lg:w-5/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-between order-3 lg:order-2">

			{#key currentIndex}
				<div class="info-wrapper" bind:this={infoContainer}>
					<div class="mb-10">
						<p class="primary-font text-xl text-zinc-500">{galleryData.collection}</p>
						<h2 class="primary-font text-5xl md:text-6xl font-bold text-zinc-900 mb-3">{galleryData.subCollection}</h2>
						<h3 class="primary-font text-2xl text-zinc-800 mb-8">{galleryData.title}</h3>
						<p class="secondary-font text-zinc-600 leading-relaxed text-base">{galleryData.watchDescription}</p>
					</div>

					<div class="border-t border-zinc-200 pt-8">
						<h4 class="primary-font text-xl text-zinc-900 mb-5">Specifications</h4>
						<div class="grid grid-cols-2 gap-x-8 gap-y-4 text-base">
							{#each galleryData.specs as spec}
								<div class="secondary-font">
									<p class="text-zinc-500">{spec.label}</p>
									<p class="text-zinc-800 font-medium">{spec.value}</p>
								</div>
							{/each}
						</div>
					</div>
					<div class="mt-8">
						<h4 class="primary-font text-xl text-zinc-900 mb-3">Gemstones</h4>
						<p class="secondary-font text-zinc-600 text-base leading-relaxed">
							{galleryData.gemstones.join(' / ')}
						</p>
					</div>
				</div>
			{/key}

			<!-- Desktop-Only Navigation section -->
			{#if galleryData.slides.length > 0}
				<div class="navigation-controls hidden lg:flex items-center space-x-6 mt-12 pt-8 border-t border-zinc-200">
					<button class="swiper-button-prev p-3 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors duration-300">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
					</button>
					<button class="swiper-button-next p-3 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors duration-300">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.swiper-button-next::after,
	.swiper-button-prev::after {
		display: none;
	}
	.info-wrapper {
		position: relative;
	}
</style>
