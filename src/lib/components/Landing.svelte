<script>
	import LandingBg from '$lib/assets/images/LandingBG.webp';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import FirstWatchImage from '$lib/assets/images/FirstwatchImage.webp';
	import WatchDetailImage from '$lib/assets/images/FirstWatchImageCloseUP.webp';

	let imagesLoaded = false;
	let animationsInitialized = false;
	gsap.registerPlugin(ScrollTrigger);

	onMount(() => {
		gsap.set('.LandingTextElem', { opacity: 0, y: 30 });
		gsap.set('.LandingBG', { opacity: 0, scale: 1.5 });
		gsap.set('.watch-image', { opacity: 0 });
		gsap.set('.detail-line', { width: 0 });
		gsap.set('.detail-text', { opacity: 0, x: -20 });
		gsap.set('.detail-image', { opacity: 0, scale: 0.3 });

		const preloadImages = () => {
			const imagePromises = [
				new Promise(resolve => {
					const bgImg = new Image();
					bgImg.onload = resolve;
					bgImg.onerror = resolve;
					bgImg.src = LandingBg;
				}),
				new Promise(resolve => {
					const watchImg = new Image();
					watchImg.onload = resolve;
					watchImg.onerror = resolve;
					watchImg.src = FirstWatchImage;
				})
			];

			return Promise.all(imagePromises);
		};

		preloadImages().then(() => {
			imagesLoaded = true;

			const mainTimeline = gsap.timeline({
				onComplete: () => {
					animationsInitialized = true;
					initScrollAnimations();
				}
			});

			mainTimeline
				.to('.LandingBG', {
					delay: 0.5,
					scale: 1,
					opacity: 1,
					duration: 0.8,
					ease: 'power1.out'
				})
				.to('.LandingTextElem', {
					opacity: 1,
					y: 0,
					stagger: 0.15,
					duration: 0.6,
					ease: 'power1.out'
				}, '-=0.3')
				.to('.watch-image', {
					opacity: 0.8,
					duration: 0.8,
					ease: 'power1.inOut'
				}, '-=0.3');
		});
	});

	function initScrollAnimations() {

		let firstSectionParallaxTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.AfterLandingSection',
				start: 'top bottom',
				end: 'top top',
				scrub: true
			}
		});

		firstSectionParallaxTimeline.to('.LandingBG', {
			y: '50%',
			opacity: 0.2,
			scale: 1.2,
			ease: 'none'
		});

		let secondSectionParallaxTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.AfterLandingSection',
				start: 'top bottom',
				end: 'center center',
				scrub: true
			}
		});

		secondSectionParallaxTimeline.fromTo('.watch-image',
			{
				opacity: 0.8,
				scale: 2.5,
				transformOrigin: 'center center'
			},
			{
				opacity: 1,
				scale: 1,
				ease: 'none'
			}
		);

		let detailsTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.AfterLandingSection',
				start: 'top 40%',
				end: 'bottom bottom',
				toggleActions: 'play none none reset',
				scrub: true
			}
		});

		detailsTimeline.to('.detail-line-left', {
			width: '50%',
			duration: 0.6,
			ease: 'power2.inOut'
		}, 0);

		detailsTimeline.to('.detail-line-right', {
			width: '50%',
			duration: 0.6,
			ease: 'power2.inOut'
		}, 0);

		detailsTimeline.to('.detail-text', {
			opacity: 1,
			x: 0,
			stagger: 0.2,
			duration: 0.5,
			ease: 'power2.out'
		}, 0.4);

		detailsTimeline.to('.detail-image', {
			opacity: 1,
			scale: 1,
			duration: 0.7,
			ease: 'back.out(1.7)'
		}, 0.5);
	}

	function lazyLoadImage(node) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target;
					const src = img.dataset.src;
					if (src) {
						img.src = src;
						img.removeAttribute('data-src');
					}
					observer.unobserve(img);
				}
			});
		}, { rootMargin: '200px' });

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<div class="loading-overlay" class:hidden={imagesLoaded}>
	<div class="newtons-cradle">
		<div class="newtons-cradle__dot"></div>
		<div class="newtons-cradle__dot"></div>
		<div class="newtons-cradle__dot"></div>
		<div class="newtons-cradle__dot"></div>
	</div>
</div>

<div
	class="LandingSection h-screen w-full relative flex justify-center items-start pt-[5%] overflow-hidden bg-gradient">
	<img src="{LandingBg}" alt="Background img" loading="eager"
			 class="LandingBG absolute top-0 left-0 h-screen w-full object-cover z-0 overflow-hidden">
	<div class="LandingTextElemContainer w-full h-fit flex justify-around items-center z-10 text-white/90">
		<div class="LandingTextElem h-fit w-1/4 text-right uppercase secondary-font">Meet</div>
		<div class="LandingTextElem h-fit w-2/4 text-center text-9xl primary-font font-[600]">The Jewelry Watch</div>
		<div class="LandingTextElem h-fit w-1/4 text-left uppercase secondary-font">BY ASIS</div>
	</div>
</div>

<div class="AfterLandingSection h-[110vh] w-full relative flex justify-center items-center bg-gradient overflow-hidden">
	<div class="w-full h-full flex flex-col md:flex-row items-center justify-center relative">
		<div class="watch-container relative h-full w-full md:w-3/4 flex justify-center items-center overflow-hidden">
			<img src="{FirstWatchImage}" alt="ASIS Luxury Watch" class="watch-image w-full h-full object-cover"
					 loading="eager">

			<div class="absolute w-[300px] left-1/5 top-1/4 transform -translate-1/2
									flex items-center justify-center">
				<div class="detail-text mr-2 text-right w-3/4 tracking-tight">
					<div class="text-xs uppercase secondary-font">Case Design</div>
					<div class="text-sm font-bold secondary-font">Stainless Steel</div>
					<div class="mt-2 flex justify-end items-center border-2">
						<!-- Use data-src for lazy loading -->
						<img data-src="{WatchDetailImage}" alt="Watch case detail"
								 class="detail-image w-full h-full object-cover"
								 use:lazyLoadImage>
					</div>
				</div>
				<div class="detail-line detail-line-left h-px w-1/2 bg-black origin-left"></div>
			</div>

			<div class="absolute w-[300px] right-[12.5%] top-2/3 flex items-center">
				<div class="detail-line detail-line-right h-px w-1/2 bg-black origin-right"></div>
				<div class="detail-text ml-2 w-1/2 secondary-font">
					<div class="text-xs uppercase">Movement</div>
					<div class="text-sm font-bold">Swiss Automatic</div>
				</div>
			</div>
		</div>

		<div class="w-full md:w-1/4 px-6 mt-8 md:mt-0">
			<div class="detail-text">
				<h2 class="text-2xl font-light uppercase mb-2 primary-font">PRECISION TIMEPIECE</h2>
				<h3 class="text-3xl font-bold mb-6 primary-font">№1 - M1835S</h3>
				<p class="text-sm mb-8 secondary-font tracking-tight">
					CRAFTED WITH EXQUISITE ATTENTION TO DETAIL.
					SWISS MOVEMENT AND WATER-RESISTANT UP TO 100M.
				</p>
				<div class="text-sm text-gray-600 secondary-font tracking-tighter">
					CASE SIZE: Ø 33.0 MM <br />
					STRAP WIDTH: 16 X 16 MM
				</div>
			</div>
		</div>
	</div>
</div>

<style>
    .LandingBG {
        will-change: transform, opacity;
    }

    .LandingTextElem {
        will-change: opacity, transform;
    }

    .watch-image {
        will-change: transform, opacity, scale;
    }

    .detail-line, .detail-text, .detail-image {
        transition: will-change 0.2s;
    }

    .AfterLandingSection:hover .detail-line {
        will-change: width;
    }

    .AfterLandingSection:hover .detail-text,
    .AfterLandingSection:hover .detail-image {
        will-change: opacity, transform;
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
        transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
    }

    .loading-overlay.hidden {
        opacity: 0;
        visibility: hidden;
    }

    .newtons-cradle {
        --uib-size: 50px;
        --uib-speed: 1.2s;
        --uib-color: #474554;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--uib-size);
        height: var(--uib-size);
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
        0% {
            transform: rotate(0deg);
            animation-timing-function: ease-out;
        }

        25% {
            transform: rotate(70deg);
            animation-timing-function: ease-in;
        }

        50% {
            transform: rotate(0deg);
            animation-timing-function: linear;
        }
    }

    @keyframes swing2 {
        0% {
            transform: rotate(0deg);
            animation-timing-function: linear;
        }

        50% {
            transform: rotate(0deg);
            animation-timing-function: ease-out;
        }

        75% {
            transform: rotate(-70deg);
            animation-timing-function: ease-in;
        }
    }

</style>
