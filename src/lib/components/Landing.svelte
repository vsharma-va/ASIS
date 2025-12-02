<script>
	import LandingBg from '$lib/assets/images/LandingBG.webp';
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import FirstWatchImage from '$lib/assets/images/FirstwatchImage.webp';
	import WatchDetailImage from '$lib/assets/images/FirstWatchImageCloseUP.webp';
	import WatchDetailImage2 from '$lib/assets/images/FirstWatchImageCloseUP.webp';
	// NEW third detail image
	import WatchDetailImage3 from '$lib/assets/images/FirstWatchImageCloseUP.webp';
	import { setComponentReady, registerComponent, unregisterComponent } from '$lib/stores/loadingStore';
	import logoImg from '$lib/assets/images/AS IS.png';

	let imagesLoaded = false;
	let ctx;
	let isMobile = false;

	gsap.registerPlugin(ScrollTrigger);

	// Register this component immediately when script runs
	registerComponent('landing');

	const preloadImages = async () => {
		const images = [LandingBg, FirstWatchImage, WatchDetailImage, WatchDetailImage2, WatchDetailImage3];
		await Promise.all(images.map(src => {
			return new Promise(resolve => {
				const img = new Image();
				img.onload = async () => {
					try {
						await img.decode();
					} catch (e) {
						console.error(e);
					}
					resolve();
				};
				img.onerror = resolve;
				img.src = src;
			});
		}));
		imagesLoaded = true;
	};

	onMount(() => {
		isMobile = window.innerWidth < 768;

		const handleResize = () => {
			isMobile = window.innerWidth < 768;
		};
		window.addEventListener('resize', handleResize, { passive: true });

		ctx = gsap.context(() => {
			// include third set selectors in initial set
			gsap.set(['.LandingBG', '.LandingTextElem', '.watch-image', '.detail-text', '.detail-image', '.detail-text-second', '.detail-image-second', '.detail-text-third', '.detail-image-third'], {
				opacity: 0,
				force3D: true,
				backfaceVisibility: 'hidden',
				perspective: 1000
			});

			gsap.set(['.detail-line', '.detail-line-second', '.detail-line-third'], {
				scaleX: 0,
				transformOrigin: 'left center',
				opacity: 1,
				force3D: true
			});
			gsap.set('.LandingBG', {
				scale: isMobile ? 1.08 : 1.15,
				transformOrigin: 'center center'
			});
			gsap.set('.LandingTextElem', { y: isMobile ? 20 : 30 });
			gsap.set('.watch-image', {
				scale: isMobile ? 1.6 : 1.8,
				transformOrigin: 'center center'
			});
			gsap.set('.detail-line', { scaleX: 0, transformOrigin: 'left center' });
			gsap.set('.detail-line-second', { scaleX: 0, transformOrigin: 'left center' });
			gsap.set('.detail-line-third', { scaleX: 0, transformOrigin: 'left center' });
			gsap.set('.detail-text', { x: isMobile ? -10 : -20, y: 0 });
			gsap.set('.detail-text-second', { x: isMobile ? -10 : -20, y: 30 });
			gsap.set('.detail-text-third', { x: isMobile ? -10 : -20, y: 30 });
			gsap.set('.detail-image', { scale: 0.8, transformOrigin: 'center center' });
			gsap.set('.detail-image-second', { scale: 0.8, transformOrigin: 'center center' });
			gsap.set('.detail-image-third', { scale: 0.8, transformOrigin: 'center center' });

			preloadImages().then(() => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
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
								ease: 'power2.inOut'
							}, '-=0.6')
							.to('.watch-image', {
								opacity: 0.8,
								scale: isMobile ? 1.1 : 1.2,
								duration: 1,
								ease: 'power2.inOut'
							}, '-=0.4');

						tl.call(() => {
							setupScrollAnimations();
							// Report Landing component as ready after animations are set up
							setComponentReady('landing', true);
						});
					});
				});
			});
		});

		return () => window.removeEventListener('resize', handleResize);
	});

	function setupScrollAnimations() {
		// Pin the entire section and create a master timeline
		const masterTl = gsap.timeline({
			scrollTrigger: {
				trigger: '.AfterLandingSection',
				start: 'top top',
				end: '+=400%', // increased to accommodate the third set
				scrub: 1,
				pin: true, // Pin the section
				anticipatePin: 1
			}
		});

		// Background parallax effect
		masterTl.fromTo('.LandingBG',
			{
				y: 0,
				opacity: 1,
				scale: 1
			},
			{
				y: `${isMobile ? -15 : -25}%`,
				opacity: 0.3,
				scale: isMobile ? 1.05 : 1.1,
				ease: 'none',
				duration: 1
			}, 0)
			.fromTo('.sloganText',
				{
					y: 0,
					opacity: 1,
					scale: 1
				},
				{
					y: `${isMobile ? -15 : -25}%`,
					opacity: 0,
					scale: isMobile ? 1.05 : 1.1,
					ease: 'none',
					duration: 1
				}, 0)

			// Watch image scaling
			.fromTo('.watch-image',
				{
					opacity: 0.8,
					scale: isMobile ? 1.1 : 1.2
				},
				{
					opacity: 1,
					scale: isMobile ? 1.3 : 1.5,
					ease: 'none',
					duration: 0.5
				}, 0)

			// First set of details appear
			.to('.detail-line', {
				scaleX: !isMobile ? 1 : 0,
				opacity: 1,
				duration: 0.3,
				ease: 'power2.inOut'
			}, 0.3)

			.to('.detail-text', {
				opacity: 1,
				x: 0,
				y: 0,
				stagger: 0.1,
				duration: 0.4,
				ease: 'power2.inOut'
			}, 0.4)

			.to('.detail-image', {
				opacity: 1,
				scale: 1,
				duration: 0.4,
				ease: 'power2.inOut'
			}, 0.5)

			// Hold first details for a moment
			.to({}, { duration: 0.5 }, 0.9)

			// Fade out first details
			.to('.detail-text', {
				opacity: 0,
				y: -30,
				stagger: 0.05,
				duration: 0.3,
				ease: 'power2.inOut'
			}, 1.4)

			.to('.detail-image', {
				opacity: 0,
				scale: 0.8,
				duration: 0.3,
				ease: 'power2.inOut'
			}, 1.4)

			.to('.detail-line', {
				scaleX: 0,
				opacity: 0,
				duration: 0.3,
				ease: 'power2.inOut'
			}, 1.4)

			// Small pause before second details
			.to({}, { duration: 0.2 }, 1.7)

			// Second set of details appear
			.to('.detail-line-second', {
				scaleX: !isMobile ? 1 : 0,
				duration: 0.3,
				opacity: 1,
				ease: 'power2.inOut'
			}, 1.9)

			.to('.detail-text-second', {
				opacity: 1,
				x: 0,
				y: 0,
				stagger: 0.1,
				duration: 0.4,
				ease: 'power2.inOut'
			}, 2.0)

			.to('.detail-image-second', {
				opacity: 1,
				scale: 1,
				duration: 0.4,
				ease: 'power2.inOut'
			}, 2.1)

			// Hold second details for a moment
			.to({}, { duration: 0.5 }, 2.5)

			// Fade out second details
			.to('.detail-text-second', {
				opacity: 0,
				y: -30,
				stagger: 0.05,
				duration: 0.3,
				ease: 'power2.inOut'
			}, 2.9)

			.to('.detail-image-second', {
				opacity: 0,
				scale: 0.8,
				duration: 0.3,
				ease: 'power2.inOut'
			}, 2.9)

			.to('.detail-line-second', {
				scaleX: 0,
				duration: 0.3,
				opacity: 0,
				ease: 'power2.inOut'
			}, 2.9)

			// Small pause before third details
			.to({}, { duration: 0.2 }, 3.2)

			// Third set of details appear
			.to('.detail-line-third', {
				scaleX: !isMobile ? 1 : 0,
				opacity: 1,
				duration: 0.3,
				ease: 'power2.inOut'
			}, 3.4)

			.to('.detail-text-third', {
				opacity: 1,
				x: 0,
				y: 0,
				stagger: 0.1,
				duration: 0.4,
				ease: 'power2.inOut'
			}, 3.5)

			.to('.detail-image-third', {
				opacity: 1,
				scale: 1,
				duration: 0.4,
				ease: 'power2.inOut'
			}, 3.6)

			// Hold third details until the end
			.to({}, { duration: 0.6 }, 4.0);
	}

	onDestroy(() => {
		ctx?.revert();
		// Unregister component when destroyed
		unregisterComponent('landing');
	});
</script>

<div
	class="LandingSection h-screen w-full relative flex justify-center items-start pt-[5%] sm:pt-[3%] md:pt-[5%] overflow-hidden bg-gradient">
	<img src="{LandingBg}" alt="Background img" loading="eager"
		 class="LandingBG absolute top-0 left-0 h-screen w-full object-cover z-0">

	<div
		class="LandingTextElemContainer w-full h-full flex flex-col justify-center items-center z-10 text-white/90 px-4 -mt-[10rem]">

		<div class="flex flex-col w-fit max-w-full">

			<div class="self-start uppercase secondary-font text-base sm:text-sm mb-2 sm:mb-0">
				Meet
			</div>

			<div class="text-center sm:text-left text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[5.5rem]
             primary-font font-[600] mb-2 sm:mb-0 leading-[0.8] capitalize whitespace-nowrap">
				The Exclusive Jewelry Watch
			</div>

			<div class="self-end uppercase secondary-font text-xs sm:text-sm">
				<div class="flex items-center justify-end gap-2">
					<span class="align-text-bottom -mb-[0.6rem]">BY</span>
					<img src="{logoImg}" alt="ASIS" class="h-6 w-auto object-contain" />
				</div>
			</div>

		</div>
	</div>
</div>

<!-- Increased height but the pin will handle the scroll behavior -->
<div class="AfterLandingSection h-screen w-full relative flex justify-center items-center bg-gradient overflow-hidden">
	<div class="w-full h-full flex flex-col lg:flex-row items-center justify-center relative px-4 lg:px-0">
		<div
			class="watch-container relative h-full lg:h-full w-full lg:w-3/4 flex justify-center items-center overflow-hidden">
			<img src="{FirstWatchImage}" alt="ASIS Luxury Watch"
				 class="watch-image w-full h-full object-cover lg:object-contain"
				 loading="eager">
			<div class="sloganText h-fit w-full text-center text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[5.5rem]
                     primary-font font-[600] mb-2 sm:mb-0 leading-[0.8] capitalize text-white/90
                   absolute top-[35%] left-1/2 transform-3d -translate-1/2">
				You are unique as is
			</div>

			<!-- Mobile details - First Set -->
			<div class="lg:hidden absolute top-4 left-4 right-4 flex flex-col gap-4 detail-set-1">
				<div class="detail-text bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="detail-heading text-base sm:text-lg md:text-xl uppercase font-normal secondary-font">
						Case Design
					</div>
					<div class="detail-desc text-xs sm:text-sm uppercase font-bold secondary-font">Stainless Steel</div>
				</div>
				<div class="detail-text bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="detail-heading text-base sm:text-lg md:text-xl uppercase font-normal secondary-font">
						Movement
					</div>
					<div class="detail-desc text-xs sm:text-sm uppercase font-bold secondary-font">Swiss Automatic</div>
				</div>
				<div class="detail-text bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="detail-heading text-base sm:text-lg md:text-xl uppercase font-normal secondary-font">
						Metal
					</div>
					<div class="detail-desc text-xs sm:text-sm uppercase font-bold secondary-font">High Grade Steel
					</div>
				</div>
			</div>

			<!-- Mobile details - Second Set -->
			<div class="lg:hidden absolute top-4 left-4 right-4 flex flex-col gap-4 detail-set-2">
				<div class="detail-text-second bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="detail-heading text-base sm:text-lg md:text-xl uppercase font-normal secondary-font">
						STRAP
					</div>
					<div class="detail-desc text-xs sm:text-sm uppercase font-bold secondary-font">Genuine Alligator
						Leather / Vegan Leather
					</div>
				</div>
				<div class="detail-text-second bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="detail-heading text-base sm:text-lg md:text-xl uppercase font-normal secondary-font">
						GLASS
					</div>
					<div class="detail-desc text-xs sm:text-sm uppercase font-bold secondary-font">Sapphire Glass</div>
				</div>
				<div class="detail-text-second bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="detail-heading text-base sm:text-lg md:text-xl uppercase font-normal secondary-font">
						WARRANTY
					</div>
					<div class="detail-desc text-xs sm:text-sm uppercase font-bold secondary-font">2 Year International
						Warranty
					</div>
				</div>
			</div>

			<!-- Mobile details - Third Set -->
			<div class="lg:hidden absolute top-4 left-4 right-4 flex flex-col gap-4 detail-set-3">
				<div class="detail-text-third bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="detail-heading text-base sm:text-lg md:text-xl uppercase font-normal secondary-font">
						FINISH
					</div>
					<div class="detail-desc text-xs sm:text-sm uppercase font-bold secondary-font">Polished & Brushed
						Options
					</div>
				</div>
				<div class="detail-text-third bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="detail-heading text-base sm:text-lg md:text-xl uppercase font-normal secondary-font">
						WATER RESIST
					</div>
					<div class="detail-desc text-xs sm:text-sm uppercase font-bold secondary-font">50m / 5 ATM</div>
				</div>
				<div class="detail-text-third bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="detail-heading text-base sm:text-lg md:text-xl uppercase font-normal secondary-font">
						CERTIFICATION
					</div>
					<div class="detail-desc text-xs sm:text-sm uppercase font-bold secondary-font">Hallmarked &
						Certified
					</div>
				</div>
			</div>

			<!-- Desktop details - First Set -->
			<div
				class="hidden lg:flex absolute left-[-5%] top-[28%] -translate-y-1/2 items-center justify-end w-[500px] detail-set-1 gap-2">
				<div class="detail-text text-right space-y-3 z-10 mix-blend-multiply">
					<div
						class="detail-heading text-xl uppercase font-thin tracking-[0.3em] text-gray-900 secondary-font">
						Gemstones
					</div>
					<div
						class="detail-desc text-[10px] uppercase font-semibold tracking-[0.2em] text-gray-500 secondary-font">
						Natural Diamonds & Colorstones
					</div>
				</div>

				<div class="detail-line h-[1px] bg-gray-400/60 w-20"></div>

				<div
					class="detail-image relative w-40 h-40 shrink-0 border-[1.5px] border-white/50 bg-white/10 backdrop-blur-xl rounded-full shadow-2xl overflow-hidden p-1">
					<img src="{WatchDetailImage}" alt="Gemstones detail"
						 class="w-full h-full object-cover rounded-full transform hover:scale-105 transition-transform duration-700 ease-out"
						 loading="eager">
				</div>
			</div>

			<div
				class="hidden lg:flex absolute right-[2%] top-[22%] -translate-y-1/2 items-center w-[500px] detail-set-1 gap-8">
				<div
					class="detail-image relative w-32 h-32 shrink-0 border-[1.5px] border-white/50 bg-white/10 backdrop-blur-xl rounded-full shadow-2xl overflow-hidden p-1.5">
					<img src="{WatchDetailImage}" alt="Movement detail"
						 class="w-full h-full object-cover rounded-full transform hover:scale-105 transition-transform duration-700 ease-out"
						 loading="eager">
				</div>

				<div class="detail-line h-[1px] bg-gray-400/30 w-32"></div>

				<div class="detail-text text-left space-y-3 z-10 mix-blend-multiply">
					<div
						class="detail-heading text-2xl uppercase font-thin tracking-[0.3em] text-gray-900 secondary-font">
						Movement
					</div>
					<div
						class="detail-desc text-[10px] uppercase font-semibold tracking-[0.2em] text-gray-500 secondary-font">
						Swiss Automatic
					</div>
				</div>
			</div>

			<div
				class="hidden lg:flex absolute right-[2%] top-[78%] -translate-y-1/2 items-center w-[500px] detail-set-1 gap-8">
				<div
					class="detail-image relative w-32 h-32 shrink-0 border-[1.5px] border-white/50 bg-white/10 backdrop-blur-xl rounded-full shadow-2xl overflow-hidden p-1.5">
					<img src="{WatchDetailImage}" alt="Metal detail"
						 class="w-full h-full object-cover rounded-full transform hover:scale-105 transition-transform duration-700 ease-out"
						 loading="eager">
				</div>

				<div class="detail-line h-[1px] bg-gray-400/30 w-32"></div>

				<div class="detail-text text-left space-y-3 z-10 mix-blend-multiply">
					<div
						class="detail-heading text-2xl uppercase font-thin tracking-[0.3em] text-gray-900 secondary-font">
						Metal
					</div>
					<div
						class="detail-desc text-[10px] uppercase font-semibold tracking-[0.2em] text-gray-500 secondary-font">
						High Grade Steel
					</div>
				</div>
			</div>

			<!-- Desktop details - Second Set -->
			<div
				class="hidden lg:block absolute w-[250px] xl:w-[300px] left-1/5 top-[33.33333%] transform -translate-1/2 detail-set-2">
				<div class="flex items-center justify-center">
					<div class="detail-text-second mr-2 text-right w-3/4 tracking-tight">
						<div class="detail-heading text-2xl uppercase font-light tracking-wide secondary-font">STRAP
						</div>
						<div class="detail-desc text-xs uppercase tracking-wide font-bold secondary-font">Genuine
							Alligator
							Leather /
							Vegan Leather
						</div>
						<div
							class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">
							<img src="{WatchDetailImage2}" alt="Watch craftsmanship detail"
								 class="detail-image-second w-full h-full object-cover"
								 loading="eager">
						</div>
					</div>
					<div
						class="detail-line-second h-px bg-black origin-left w-12 -mt-[16.5rem] translate-x-[25px]"></div>
				</div>
			</div>

			<div
				class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-[25%] -translate-y-1/2 items-center detail-set-2">
				<div class="detail-line-second h-px bg-black origin-right w-12 -mt-[9.5rem] -translate-x-[25px]"></div>
				<div class="detail-text-second ml-2 w-1/2 secondary-font">
					<div class="detail-heading text-2xl uppercase font-light tracking-wider">GLASS</div>
					<div class="detail-desc text-xs uppercase font-bold tracking-wide">Sapphire Crystal</div>
					<div
						class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">
						<img src="{WatchDetailImage2}" alt="Watch craftsmanship detail"
							 class="detail-image-second w-full h-full object-cover"
							 loading="eager">
					</div>
				</div>
			</div>
			<div
				class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-[75%] -translate-y-1/2 items-center detail-set-2">
				<div class="detail-line-second h-px bg-black origin-right w-12 -mb-[7.5rem] -translate-x-[25px]"></div>
				<div class="detail-text-second ml-2 w-1/2 secondary-font">
					<div
						class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">
						<img src="{WatchDetailImage2}" alt="Watch craftsmanship detail"
							 class="detail-image-second w-full h-full object-cover"
							 loading="eager">
					</div>
					<div class="detail-heading text-lg uppercase font-light tracking-wider">WARRANTY</div>
					<div class="detail-desc text-xs uppercase font-bold tracking wide">2 Year International Warranty
					</div>
				</div>
			</div>

			<!-- Desktop details - Third Set -->
			<div
				class="hidden lg:block absolute w-[250px] xl:w-[300px] left-1/5 top-[66%] transform -translate-1/2 detail-set-3">
				<div class="flex items-center justify-center">
					<div class="detail-text-third mr-2 text-right w-3/4 tracking-tight">
						<div class="detail-heading text-lg uppercase font-normal secondary-font">cabochon</div>
						<div class="detail-desc text-xs uppercase font-black secondary-font">
							some text
						</div>
						<div
							class="mt-2 flex justify-end items-center border-4 border-[#2d6f71] rounded-full overflow-hidden">
							<img src="{WatchDetailImage3}" alt="Watch finish detail"
								 class="detail-image-third w-full h-full object-cover"
								 loading="eager">
						</div>
					</div>
					<div class="detail-line-third h-px bg-black origin-left w-12"></div>
				</div>
			</div>

			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-1/3 items-center detail-set-3">
				<div class="detail-line-third h-px bg-black origin-right w-12"></div>
				<div class="detail-text-third ml-2 w-1/2 secondary-font">
					<div class="detail-heading text-lg uppercase font-normal">Buckle</div>
					<div class="detail-desc text-xs uppercase font-black">some text</div>
				</div>
			</div>
			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-2/3 items-center detail-set-3">
				<div class="detail-line-third h-px bg-black origin-right w-12"></div>
				<div class="detail-text-third ml-2 w-1/2 secondary-font">
					<div class="detail-heading text-lg uppercase font-normal">warranty</div>
					<div class="detail-desc text-xs uppercase font-black">some text</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.LandingBG, .LandingTextElem, .watch-image, .detail-line, .detail-text, .detail-image,
	.detail-line-second, .detail-text-second, .detail-image-second, .detail-line-third, .detail-text-third, .detail-image-third {
		will-change: transform;
	}

	.detail-set-1, .detail-set-2, .detail-set-3 {
		pointer-events: none;
	}

	.detail-set-2 {
		z-index: 1;
	}

	.detail-set-1 {
		z-index: 2;
	}

	.detail-set-3 {
		z-index: 0;
	}

	/* utility: if you want a tiny tweak to spacing or font sizes, change here */
	.detail-heading {
		/* heading bolder control handled via Tailwind classes in markup */
	}

	.detail-desc {
		/* description control handled via Tailwind classes in markup */
	}

	@media (max-width: 768px) {
		.watch-container {
			padding: 1rem 0;
		}
	}
</style>
