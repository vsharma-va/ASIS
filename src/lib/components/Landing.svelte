<script>
	import LandingBg from '$lib/assets/images/LandingBG.webp';
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import FirstWatchImage from '$lib/assets/images/FirstwatchImage.webp';
	import WatchDetailImage from '$lib/assets/images/FirstWatchImageCloseUP.webp';
	// Placeholder for second detail image
	import WatchDetailImage2 from '$lib/assets/images/FirstWatchImageCloseUP.webp';

	let imagesLoaded = false;
	let ctx;
	let isMobile = false;

	gsap.registerPlugin(ScrollTrigger);

	const preloadImages = async () => {
		const images = [LandingBg, FirstWatchImage, WatchDetailImage, WatchDetailImage2];
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
			gsap.set(['.LandingBG', '.LandingTextElem', '.watch-image', '.detail-text', '.detail-image', '.detail-text-second', '.detail-image-second'], {
				opacity: 0,
				force3D: true,
				backfaceVisibility: 'hidden',
				perspective: 1000
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
			gsap.set('.detail-text', { x: isMobile ? -10 : -20, y: 0 });
			gsap.set('.detail-text-second', { x: isMobile ? -10 : -20, y: 30 });
			gsap.set('.detail-image', { scale: 0.8, transformOrigin: 'center center' });
			gsap.set('.detail-image-second', { scale: 0.8, transformOrigin: 'center center' });

			preloadImages().then(() => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						const tl = gsap.timeline();
						tl.to('.LandingBG', {
							scale: 1,
							opacity: 1,
							duration: 1.2,
							ease: 'power2.out',
							delay: 0.1
						})
							.to('.LandingTextElem', {
								opacity: 1,
								y: 0,
								stagger: isMobile ? 0.05 : 0.1,
								duration: 0.8,
								ease: 'power2.out'
							}, '-=0.6')
							.to('.watch-image', {
								opacity: 0.8,
								scale: isMobile ? 1.1 : 1.2,
								duration: 1,
								ease: 'power2.out'
							}, '-=0.4');

						tl.call(setupScrollAnimations);
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
				end: '+=300%', // This creates enough scroll distance for all animations
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
				duration: 0.3,
				ease: 'power2.inOut'
			}, 0.3)

			.to('.detail-text', {
				opacity: 1,
				x: 0,
				y: 0,
				stagger: 0.1,
				duration: 0.4,
				ease: 'power2.out'
			}, 0.4)

			.to('.detail-image', {
				opacity: 1,
				scale: 1,
				duration: 0.4,
				ease: 'power2.out'
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
				duration: 0.3,
				ease: 'power2.inOut'
			}, 1.4)

			// Small pause before second details
			.to({}, { duration: 0.2 }, 1.7)

			// Second set of details appear
			.to('.detail-line-second', {
				scaleX: !isMobile ? 1 : 0,
				duration: 0.3,
				ease: 'power2.inOut'
			}, 1.9)

			.to('.detail-text-second', {
				opacity: 1,
				x: 0,
				y: 0,
				stagger: 0.1,
				duration: 0.4,
				ease: 'power2.out'
			}, 2.0)

			.to('.detail-image-second', {
				opacity: 1,
				scale: 1,
				duration: 0.4,
				ease: 'power2.out'
			}, 2.1)

			// Hold second details until the end
			.to({}, { duration: 0.5 }, 2.5);
	}

	onDestroy(() => {
		ctx?.revert();
	});
</script>

<div class="loading-overlay" class:hidden={imagesLoaded}>
	<div class="newtons-cradle">
		<div class="newtons-cradle__dot"></div>
		<div class="newtons-cradle__dot"></div>
		<div class="newtons-cradle__dot"></div>
		<div class="newtons-cradle__dot"></div>
	</div>
</div>

<div class="LandingSection h-screen w-full relative flex justify-center items-start pt-[5%] sm:pt-[3%] md:pt-[5%] overflow-hidden bg-gradient">
	<img src="{LandingBg}" alt="Background img" loading="eager"
			 class="LandingBG absolute top-0 left-0 h-screen w-full object-cover z-0">

	<div class="LandingTextElemContainer w-full h-full flex flex-col justify-center items-center z-10 text-white/90 px-4 sm:px-0 -mt-[10rem]">
		<div class="LandingTextElem h-fit w-full sm:w-2/4 text-center sm:text-left uppercase secondary-font text-xs sm:text-sm mb-2 sm:mb-0
         sm:-ml-[15rem]">
			Meet
		</div>
		<div class="LandingTextElem h-fit w-full text-center text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[5.5rem]
         primary-font font-[600] mb-2 sm:mb-0 leading-[0.8] capitalize">
			The Exclusive Jewelry Watch
		</div>
		<div class="LandingTextElem h-fit w-full sm:w-2/4 text-center sm:text-right uppercase secondary-font text-xs sm:text-sm
         sm:-mr-[15rem]">
			BY ASIS
		</div>
	</div>
</div>

<!-- Increased height but the pin will handle the scroll behavior -->
<div class="AfterLandingSection h-screen w-full relative flex justify-center items-center bg-gradient overflow-hidden">
	<div class="w-full h-full flex flex-col lg:flex-row items-center justify-center relative px-4 lg:px-0">
		<div class="watch-container relative h-full lg:h-full w-full lg:w-3/4 flex justify-center items-center overflow-hidden">
			<img src="{FirstWatchImage}" alt="ASIS Luxury Watch"
					 class="watch-image w-full h-full object-cover lg:object-contain"
					 loading="eager">

			<!-- Mobile details - First Set -->
			<div class="lg:hidden absolute top-4 left-4 right-4 flex flex-col gap-4 detail-set-1">
				<div class="detail-text bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase secondary-font">Case Design</div>
					<div class="text-sm font-bold secondary-font">Stainless Steel</div>
				</div>
				<div class="detail-text bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase secondary-font">Movement</div>
					<div class="text-sm font-bold secondary-font">Swiss Automatic</div>
				</div>
				<div class="detail-text bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase secondary-font">Metal</div>
					<div class="text-sm font-bold secondary-font">High Grade Steel</div>
				</div>
			</div>

			<!-- Mobile details - Second Set -->
			<div class="lg:hidden absolute top-4 left-4 right-4 flex flex-col gap-4 detail-set-2">
				<div class="detail-text-second bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase secondary-font">STRAP</div>
					<div class="text-sm font-bold secondary-font">Genuine Alligator Leather / Vegan Leather	</div>
				</div>
				<div class="detail-text-second bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase secondary-font">GLASS</div>
					<div class="text-sm font-bold secondary-font">Sapphire Glass</div>
				</div>
				<div class="detail-text-second bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase secondary-font">WARRANTY</div>
					<div class="text-sm font-bold secondary-font">2 Year International Warranty	</div>
				</div>
			</div>

			<!-- Desktop details - First Set -->
			<div class="hidden lg:block absolute w-[250px] xl:w-[300px] left-1/5 top-1/4 transform -translate-1/2 detail-set-1">
				<div class="flex items-center justify-center">
					<div class="detail-text mr-2 text-right w-3/4 tracking-tight">
						<div class="text-xs uppercase secondary-font">GEMSTONES</div>
						<div class="text-sm font-bold secondary-font">Natural Diamonds & Colorstones</div>
						<div class="mt-2 flex justify-end items-center border-2">
							<img src="{WatchDetailImage}" alt="Watch case detail"
									 class="detail-image w-full h-full object-cover"
									 loading="eager">
						</div>
					</div>
					<div class="detail-line h-px bg-black origin-left w-12"></div>
				</div>
			</div>

			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-1/3 items-center detail-set-1">
				<div class="detail-line h-px bg-black origin-right w-12"></div>
				<div class="detail-text ml-2 w-1/2 secondary-font">
					<div class="text-xs uppercase">Movement</div>
					<div class="text-sm font-bold">Swiss Automatic</div>
				</div>
			</div>
			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-2/3 items-center detail-set-1">
				<div class="detail-line h-px bg-black origin-right w-12"></div>
				<div class="detail-text ml-2 w-1/2 secondary-font">
					<div class="text-xs uppercase">METAL</div>
					<div class="text-sm font-bold">High Grade Steel</div>
				</div>
			</div>

			<!-- Desktop details - Second Set -->
			<div class="hidden lg:block absolute w-[250px] xl:w-[300px] left-1/5 top-1/4 transform -translate-1/2 detail-set-2">
				<div class="flex items-center justify-center">
					<div class="detail-text-second mr-2 text-right w-3/4 tracking-tight">
						<div class="text-xs uppercase secondary-font">STRAP</div>
						<div class="text-sm font-bold secondary-font">Genuine Alligator Leather / Vegan Leather	</div>
						<div class="mt-2 flex justify-end items-center border-2">
							<img src="{WatchDetailImage2}" alt="Watch craftsmanship detail"
									 class="detail-image-second w-full h-full object-cover"
									 loading="eager">
						</div>
					</div>
					<div class="detail-line-second h-px bg-black origin-left w-12"></div>
				</div>
			</div>

			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-1/3 items-center detail-set-2">
				<div class="detail-line-second h-px bg-black origin-right w-12"></div>
				<div class="detail-text-second ml-2 w-1/2 secondary-font">
					<div class="text-xs uppercase">GLASS</div>
					<div class="text-sm font-bold">Sapphire Crystal	</div>
				</div>
			</div>
			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-2/3 items-center detail-set-2">
				<div class="detail-line-second h-px bg-black origin-right w-12"></div>
				<div class="detail-text-second ml-2 w-1/2 secondary-font">
					<div class="text-xs uppercase">WARRANTY</div>
					<div class="text-sm font-bold">2 Year International Warranty	</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
    .LandingBG, .LandingTextElem, .watch-image, .detail-line, .detail-text, .detail-image,
    .detail-line-second, .detail-text-second, .detail-image-second {
        will-change: transform;
    }

    .detail-set-1, .detail-set-2 {
        pointer-events: none;
    }

    .detail-set-2 {
        z-index: 1;
    }

    .detail-set-1 {
        z-index: 2;
    }

    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
    }

    .loading-overlay.hidden {
        opacity: 0;
        visibility: hidden;
    }

    .newtons-cradle {
        --uib-size: 40px;
        --uib-speed: 1.2s;
        --uib-color: #474554;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--uib-size);
        height: var(--uib-size);
    }

    @media (min-width: 640px) {
        .newtons-cradle {
            --uib-size: 50px;
        }
    }

    .newtons-cradle__dot {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        width: 25%;
        transform-origin: center top;
    }

    .newtons-cradle__dot::after {
        content: '';
        display: block;
        width: 100%;
        height: 25%;
        border-radius: 50%;
        background-color: var(--uib-color);
    }

    .newtons-cradle__dot:first-child {
        animation: swing var(--uib-speed) linear infinite;
    }

    .newtons-cradle__dot:last-child {
        animation: swing2 var(--uib-speed) linear infinite;
    }

    @keyframes swing {
        0% { transform: rotate(0deg); animation-timing-function: ease-out; }
        25% { transform: rotate(70deg); animation-timing-function: ease-in; }
        50% { transform: rotate(0deg); animation-timing-function: linear; }
    }

    @keyframes swing2 {
        0% { transform: rotate(0deg); animation-timing-function: linear; }
        50% { transform: rotate(0deg); animation-timing-function: ease-out; }
        75% { transform: rotate(-70deg); animation-timing-function: ease-in; }
    }

    @media (max-width: 768px) {
        .watch-container {
            padding: 1rem 0;
        }
    }
</style>
