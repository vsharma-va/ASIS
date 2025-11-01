<script>
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Gallery from '$lib/components/Gallery.svelte';
	import { setComponentReady, registerComponent, unregisterComponent } from '$lib/stores/loadingStore';

	// Register this component immediately when script runs
	registerComponent('watchDetail');

	let { data } = $props();
	let watchData = data.watch;
	let ctx;
	let isMobile;
	let handleResize;
	let galleryData = {
		collection: watchData.subCollection,
		subCollection: watchData.collection,
		title: watchData.title,
		watchDescription: watchData.watchDescription,
		specs: watchData.specs,
		gemstones: watchData.gemstones,
		variants: watchData.variants
	};

	onMount(() => {
		// DO NOT call resetLoading() here - it breaks the loading state!
		// The loading store is already managed by the layout and PageTransition

		gsap.registerPlugin(ScrollTrigger);

		if (!watchData) {
			goto('/404');
			return;
		}

		isMobile = window.innerWidth <= 768;

		handleResize = () => {
			isMobile = window.innerWidth < 768;
		};

		window.addEventListener('resize', handleResize, { passive: true });

		ctx = gsap.context(() => {
			gsap.set(['.LandingBG', '.LandingTextElem'], {
				opacity: 0,
				force3D: true,
				backfaceVisibility: 'hidden',
				perspective: 1000
			});

			gsap.set('.LandingBG', {
				scale: isMobile ? 1.08 : 1.15,
				transformOrigin: 'center center'
			});

			const tl = gsap.timeline();
			tl.to('.LandingBG', {
				scale: 1,
				opacity: 1,
				duration: 1.2,
				ease: 'power2.inOut',
				delay: 0.1
			})
				.to('.LandingTextElem', {
					opacity: 1,
					y: 0,
					stagger: isMobile ? 0.05 : 0.1,
					duration: 0.8,
					ease: 'power2.inOut',
					onComplete: () => {
						// Report watch detail section as ready
						setComponentReady('watchDetail', true);
					}
				}, '-=0.6');
		});

	});

	onDestroy(() => {
		// Clean up GSAP context
		if (ctx) {
			ctx.revert();
		}

		// Clean up event listeners
		if (handleResize) {
			window.removeEventListener('resize', handleResize);
		}

		// Kill ScrollTrigger instances
		ScrollTrigger.killAll();

		// Unregister component when destroyed
		unregisterComponent('watchDetail');
	});
</script>

<svelte:head>
	<title>{watchData ? `${watchData.collection}` : 'Watch Not Found'}</title>
	<meta name="description" content={watchData?.watchDescription || 'Premium luxury timepiece'} />
</svelte:head>

{#if watchData}
	<div
		class="LandingSection h-screen w-full relative flex justify-center items-start pt-[5%] sm:pt-[3%] md:pt-[5%] overflow-hidden bg-gradient -mb-[80vh]">
		<!--		<img-->
		<!--			src="{watchData.landingImage}"-->
		<!--			alt="Background img"-->
		<!--			loading="eager"-->
		<!--			class="LandingBG absolute top-0 left-0 h-screen w-full object-contain z-0"-->
		<!--		>-->

		<div
			class="LandingTextElemContainer w-full h-full flex flex-col justify-center items-center z-10 text-white/90 px-4 sm:px-0 -mt-[20rem]">
			<div
				class="LandingTextElem h-fit w-full sm:w-2/4 text-center sm:text-left uppercase secondary-font text-xs sm:text-sm mb-2 sm:mb-0 sm:-ml-[5rem]">
				Meet
			</div>
			<div
				class="LandingTextElem h-fit w-full text-center text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[6rem] primary-font font-[600] mb-2 sm:mb-0 leading-[0.8] capitalize">
				{watchData.collection + " " + watchData.subCollection}
			</div>
			<div
				class="LandingTextElem h-fit w-full sm:w-2/4 text-center sm:text-right uppercase secondary-font text-xs sm:text-sm sm:-mr-[5rem]">
				BY ASIS
			</div>
		</div>
	</div>
	<Gallery {galleryData} />
{:else}
	<!-- Loading State -->
	<div
		class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
			<p class="text-white/70 text-lg">Loading watch details...</p>
		</div>
	</div>
{/if}