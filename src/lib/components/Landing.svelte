<script>
	import LandingBg from '$lib/assets/images/LandingBG.webp';
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import FirstWatchImage from '$lib/assets/images/FirstwatchImage.webp';
	import WatchDetailImage from '$lib/assets/images/FirstWatchImageCloseUP.webp';
	import WatchDetailImage2 from '$lib/assets/images/FirstWatchImageCloseUP.webp';
	import WatchDetailImage3 from '$lib/assets/images/FirstWatchImageCloseUP.webp';
	import { setComponentReady, registerComponent, unregisterComponent } from '$lib/stores/loadingStore';
	import logoImg from '$lib/assets/images/AS IS.png';
	import { fade, scale } from 'svelte/transition'; // Standard svelte transitions for the modal
	import movementImg from "$lib/assets/images/movement.jpeg";
	import buckleImg from "$lib/assets/images/buckle.jpeg";
	import crownImg from "$lib/assets/images/crown.jpeg";
	import leatherImg from "$lib/assets/images/leather.jpeg";
	import certificationImg from "$lib/assets/images/certification.jpeg";

	let imagesLoaded = false;
	let ctx;
	let isMobile = false;
	let activeDetail = null; // Track which detail is currently expanded

	// Data structure for the Mobile Squircles
	const mobileDetails = [
		{
			id: 1,
			title: 'Strap',
			desc: 'Genuine Alligator / Vegan Leather',
			img: WatchDetailImage2,
			top: '15%',
			left: '10%'
		},
		{ id: 2, title: 'Glass', desc: 'Sapphire Crystal', img: WatchDetailImage2, top: '25%', right: '5%' },
		{ id: 3, title: 'Movement', desc: 'Swiss Automatic', img: movementImg, top: '60%', left: '8%' },
		{ id: 4, title: 'Metal', desc: 'High Grade Steel', img: WatchDetailImage, top: '75%', right: '10%' },
		{ id: 5, title: 'Finish', desc: 'Polished & Brushed', img: WatchDetailImage3, top: '85%', left: '35%' }
	];

	gsap.registerPlugin(ScrollTrigger);
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

	// Scroll Lock Helper
	$: if (typeof document !== 'undefined') {
		if (activeDetail) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	function openDetail(detail) {
		activeDetail = detail;
	}

	function closeDetail() {
		activeDetail = null;
	}

	onMount(() => {
		isMobile = window.innerWidth < 768;
		const handleResize = () => {
			isMobile = window.innerWidth < 768;
		};
		window.addEventListener('resize', handleResize, { passive: true });

		ctx = gsap.context(() => {
			// --- SHARED SETUP ---
			gsap.set('.LandingBG', { scale: isMobile ? 1.08 : 1.15, transformOrigin: 'center center' });
			gsap.set('.LandingTextElem', { y: isMobile ? 20 : 30 });
			gsap.set('.watch-image', { scale: isMobile ? 1.6 : 1.8, transformOrigin: 'center center' });

			// --- DESKTOP ONLY SETUP ---
			if (!isMobile) {
				gsap.set(['.detail-text', '.detail-image', '.detail-text-second', '.detail-image-second', '.detail-text-third', '.detail-image-third'], {
					opacity: 0, force3D: true, backfaceVisibility: 'hidden', perspective: 1000
				});
				gsap.set(['.detail-line', '.detail-line-second', '.detail-line-third'], {
					scaleX: 0, transformOrigin: 'left center', opacity: 1, force3D: true
				});
				gsap.set('.detail-text', { x: -20, y: 0 });
				gsap.set('.detail-image', { scale: 0.8, transformOrigin: 'center center' });
				// ... (add other desktop sets if needed, keeping it concise for brevity)
			}

			// --- MOBILE SPECIFIC SETUP (Floating Squircles) ---
			if (isMobile) {
				// Gentle floating animation for the squircles
				gsap.to('.mobile-squircle', {
					y: 15,
					duration: 2.5,
					ease: 'sine.inOut',
					stagger: {
						amount: 1.5,
						from: 'random'
					},
					yoyo: true,
					repeat: -1
				});

				// Fade them in initially
				gsap.from('.mobile-squircle', {
					opacity: 0,
					scale: 0,
					duration: 1,
					ease: 'back.out(1.7)',
					stagger: 0.1,
					delay: 0.5
				});
			}

			preloadImages().then(() => {
				requestAnimationFrame(() => {
					// Intro Animation
					const tl = gsap.timeline();
					tl.to('.LandingBG', { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.inOut', delay: 0.1 })
						.to('.LandingTextElem', {
							opacity: 1,
							y: 0,
							stagger: 0.1,
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
						setComponentReady('landing', true);
					});
				});
			});
		});

		return () => window.removeEventListener('resize', handleResize);
	});

	function setupScrollAnimations() {
		// Only run the complex scroll trigger logic if on Desktop
		// On mobile, we want the watch to stay relatively static/floating and not scrub wildly

		const masterTl = gsap.timeline({
			scrollTrigger: {
				trigger: '.AfterLandingSection',
				start: 'top top',
				end: isMobile ? '+=100%' : '+=400%',
				scrub: 1,
				pin: true,
				anticipatePin: 1
			}
		});

		// Background parallax (Shared)
		masterTl.fromTo('.LandingBG',
			{ y: 0, opacity: 1, scale: 1 },
			{ y: -25 + '%', opacity: 0.3, scale: 1.1, ease: 'none', duration: 1 }, 0)
			.fromTo('.sloganText',
				{ y: 0, opacity: 1, scale: 1 },
				{ y: -25 + '%', opacity: 0, scale: 1.1, ease: 'none', duration: 1 }, 0);

		if (!isMobile) {
			// --- DESKTOP SCROLL SEQUENCE (UNCHANGED) ---
			masterTl.fromTo('.watch-image', { opacity: 0.8, scale: 1.2 }, {
				opacity: 1,
				scale: 1.5,
				ease: 'none',
				duration: 0.5
			}, 0)

				// Set 1
				.to('.detail-line', { scaleX: 1, opacity: 1, duration: 0.3 }, 0.3)
				.to('.detail-text', { opacity: 1, x: 0, y: 0, stagger: 0.1, duration: 0.4 }, 0.4)
				.to('.detail-image', { opacity: 1, scale: 1, duration: 0.4 }, 0.5)
				.to({}, { duration: 0.5 }, 0.9) // Hold
				.to(['.detail-text', '.detail-image', '.detail-line'], { opacity: 0, duration: 0.3 }, 1.4)

				// Set 2
				.to('.detail-line-second', { scaleX: 1, opacity: 1, duration: 0.3 }, 1.9)
				.to('.detail-text-second', { opacity: 1, x: 0, y: 0, stagger: 0.1, duration: 0.4 }, 2.0)
				.to('.detail-image-second', { opacity: 1, scale: 1, duration: 0.4 }, 2.1)
				.to({}, { duration: 0.5 }, 2.5) // Hold
				.to(['.detail-text-second', '.detail-image-second', '.detail-line-second'], {
					opacity: 0,
					duration: 0.3
				}, 2.9)

				// Set 3
				.to('.detail-line-third', { scaleX: 1, opacity: 1, duration: 0.3 }, 3.4)
				.to('.detail-text-third', { opacity: 1, x: 0, y: 0, stagger: 0.1, duration: 0.4 }, 3.5)
				.to('.detail-image-third', { opacity: 1, scale: 1, duration: 0.4 }, 3.6)
				.to({}, { duration: 0.6 }, 4.0);
		} else {
			// --- MOBILE SCROLL (Simplified) ---
			// Just gentle parallax for the watch, no detail triggers
			masterTl.fromTo('.watch-image',
				{ opacity: 0.8, scale: 1.1 },
				{ opacity: 1, scale: 1.15, ease: 'none', duration: 1 }, 0);
		}
	}

	onDestroy(() => {
		ctx?.revert();
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
			<div
				class="self-start font-bold uppercase secondary-font text-lg sm:text-2xl tracking-[0.2em] sm:mb-0 z-50">
				Meet
			</div>
			<div class="text-center sm:text-left text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[5.5rem]
             primary-font font-[600] mb-2 sm:mb-0 leading-[0.8] capitalize whitespace-nowrap">
				The Exclusive Jewelry Watch
			</div>
			<div class="self-end uppercase secondary-font text-xs sm:text-sm">
				<div class="flex items-center justify-end gap-1">
					<span class="align-text-bottom -mb-[1rem] font-bold
							secondary-font text-lg sm:text-xl tracking-widest z-50">BY</span>
					<img src="{logoImg}" alt="ASIS" class="h-9 w-auto object-contain" />
				</div>
			</div>
		</div>
	</div>
</div>

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

			<div class="lg:hidden absolute inset-0 pointer-events-none z-20">
				{#each mobileDetails as detail}
					<button
						class="mobile-squircle absolute pointer-events-auto flex items-center justify-center group"
						style="top: {detail.top}; left: {detail.left}; right: {detail.right};"
						on:click={() => openDetail(detail)}
					>
						<div
							class="absolute inset-0 rounded-[1.5rem] border border-white/40 animate-ping opacity-20"></div>

						<div
							class="relative w-auto h-auto min-w-[5rem] px-4 py-2 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] flex items-center gap-2 transition-transform duration-300 active:scale-95">
                        <span
							class="text-xs font-bold uppercase tracking-widest text-white/90 secondary-font drop-shadow-md">
                            {detail.title}
                        </span>
							<div class="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
								<span class="text-[10px] text-white font-bold leading-none mb-[1px]">+</span>
							</div>
						</div>
					</button>
				{/each}
			</div>

			<div
				class="hidden lg:block absolute w-[250px] xl:w-[300px] left-1/5 top-[33.33333%] transform -translate-1/2 detail-set-1">
				<div class="flex items-center justify-center">
					<div class="detail-text mr-2 text-right w-3/4 tracking-tight">
						<div class="detail-heading text-2xl uppercase font-light tracking-wide secondary-font">
							Gemstones
						</div>
						<div class="detail-desc text-xs uppercase tracking-wide font-bold secondary-font">Natural
							Diamonds & Colorstones
						</div>
						<div
							class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">
							<img src="{WatchDetailImage}" alt="Gemstones detail"
								 class="detail-image w-full h-full object-cover" loading="eager">
						</div>
					</div>
					<div class="detail-line h-px bg-black origin-left w-12 -mt-[16.5rem] translate-x-[25px]"></div>
				</div>
			</div>
			<div
				class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-[22%] -translate-y-1/2 items-center detail-set-1">
				<div class="detail-line h-px bg-black origin-right w-12 -mt-[7.5rem] -translate-x-[25px]"></div>
				<div class="detail-text ml-2 w-1/2 secondary-font">
					<div class="detail-heading text-2xl uppercase font-light tracking-wider">Movement</div>
					<div class="detail-desc text-xs uppercase font-bold tracking-wide">Swiss Quartz</div>
					<div
						class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">
						<img src="{movementImg}" alt="Movement detail"
							 class="detail-image w-full h-full object-cover" loading="eager">
					</div>
				</div>
			</div>
			<div
				class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-[68%] -translate-y-1/2 items-center detail-set-1">
				<div class="detail-line h-px bg-black origin-right w-12 -mb-[7.5rem] -translate-x-[25px]"></div>
				<div class="detail-text ml-2 w-1/2 secondary-font -mb-[7.5rem]">
<!--					<div-->
<!--						class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">-->
<!--						<img src="{WatchDetailImage}" alt="Metal detail" class="detail-image w-full h-full object-cover"-->
<!--							 loading="eager">-->
<!--					</div>-->
					<div class="detail-heading text-lg uppercase font-light tracking-wider">Metal</div>
					<div class="detail-desc text-xs uppercase font-bold tracking wide">High Grade Steel</div>
				</div>
			</div>

			<div
				class="hidden lg:block absolute w-[250px] xl:w-[300px] left-1/5 top-[33.33333%] transform -translate-1/2 detail-set-2">
				<div class="flex items-center justify-center">
					<div class="detail-text-second mr-2 text-right w-3/4 tracking-tight">
						<div class="detail-heading text-2xl uppercase font-light tracking-wide secondary-font">STRAP
						</div>
						<div class="detail-desc text-xs uppercase tracking-wide font-bold secondary-font">Genuine
							Alligator / Vegan Leather
						</div>
						<div
							class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">
							<img src="{leatherImg}" alt="Watch craftsmanship detail"
								 class="detail-image-second w-full h-full object-cover" loading="eager">
						</div>
					</div>
					<div
						class="detail-line-second h-px bg-black origin-left w-12 -mt-[16.5rem] translate-x-[25px]"></div>
				</div>
			</div>
			<div
				class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-[25%] -translate-y-1/2 items-center detail-set-2">
				<div class="detail-line-second h-px bg-black origin-right w-12 -mt-[9.5rem] -translate-x-[25px]"></div>
				<div class="detail-text-second ml-2 w-1/2 secondary-font -mt-[8.3rem]">
					<div class="detail-heading text-2xl uppercase font-light tracking-wider">GLASS</div>
					<div class="detail-desc text-xs uppercase font-bold tracking-wide">Sapphire Crystal</div>
<!--					<div-->
<!--						class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">-->
<!--						<img src="{WatchDetailImage2}" alt="Watch craftsmanship detail"-->
<!--							 class="detail-image-second w-full h-full object-cover" loading="eager">-->
<!--					</div>-->
				</div>
			</div>
			<div
				class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-[75%] -translate-y-1/2 items-center detail-set-2">
				<div class="detail-line-second h-px bg-black origin-right w-12 -mb-[7.5rem] -translate-x-[25px]"></div>
				<div class="detail-text-second ml-2 w-1/2 secondary-font -mb-[7.5rem]">
<!--					<div-->
<!--						class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">-->
<!--						<img src="{certificationImg}" alt="Watch craftsmanship detail"-->
<!--							 class="detail-image-second w-full h-full object-cover" loading="eager">-->
<!--					</div>-->
					<div class="detail-heading text-lg uppercase font-light tracking-wider">WARRANTY</div>
					<div class="detail-desc text-xs uppercase font-bold tracking wide">2 Year International Warranty
					</div>
				</div>
			</div>

			<div
				class="hidden lg:block absolute w-[250px] xl:w-[300px] left-1/5 top-[33%] transform -translate-1/2 detail-set-3">
				<div class="flex items-center justify-center">
					<div class="detail-text-third mr-2 text-right w-3/4 tracking-tight">
						<div class="detail-heading text-2xl uppercase font-light tracking-wide secondary-font">
							cabochon
						</div>
						<div class="detail-desc text-xs uppercase tracking-wide font-bold secondary-font">
							inlaid gemstone
						</div>
						<div
							class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">
							<img src="{crownImg}" alt="Watch finish detail"
								 class="detail-image-third w-full h-full object-cover" loading="eager">
						</div>
					</div>
					<div
						class="detail-line-third h-px bg-black origin-left w-12 -mt-[15rem] translate-x-[25px]"></div>
				</div>
			</div>
			<div
				class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-[25%] -translate-y-1/2 items-center detail-set-3">
				<div class="detail-line-third h-px bg-black origin-right w-12 -mt-[9.5rem] -translate-x-[25px]"></div>
				<div class="detail-text-third ml-2 w-1/2 secondary-font">
					<div class="detail-heading text-2xl uppercase font-light tracking-wider">Buckle</div>
					<div class="detail-desc text-xs uppercase font-bold tracking-wide">premium metals and inlaid gemstones</div>
					<div
						class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">
						<img src="{buckleImg}" alt="Watch buckle detail"
							 class="detail-image-third w-full h-full object-cover" loading="eager">
					</div>
				</div>
			</div>
			<div
				class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-[75%] -translate-y-1/2 items-center detail-set-3">
				<div class="detail-line-third h-px bg-black origin-right w-12 -mb-[7.5rem] -translate-x-[25px]"></div>
				<div class="detail-text-third ml-2 w-1/2 secondary-font -mb-[7.5rem]" >
					<div
						class="mt-2 flex justify-end items-center border-2 border-[#2d6f71] rounded-full overflow-hidden">
						<img src="{certificationImg}" alt="Watch warranty detail"
							 class="detail-image-third w-full h-full object-cover" loading="eager">
					</div>
					<div class="detail-heading text-lg uppercase font-light tracking-wider">certification</div>
					<div class="detail-desc text-xs uppercase font-bold tracking wide">Upon request</div>
				</div>
			</div>

		</div>
	</div>

	{#if activeDetail}
		<div
			class="fixed inset-0 z-[100] flex flex-col items-center justify-end lg:hidden"
			transition:fade={{ duration: 300 }}
		>
			<div class="absolute inset-0 bg-black/60 backdrop-blur-md" on:click={closeDetail}></div>

			<div
				class="relative w-full h-[85vh] bg-[#e8e8e8] rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
				transition:scale={{ start: 0.9, duration: 400, opacity: 0, easing: fade }}
			>
				<button
					on:click={closeDetail}
					class="absolute top-4 right-4 z-20 w-10 h-10 bg-white/50 rounded-full flex items-center justify-center text-black font-bold backdrop-blur-sm"
				>
					✕
				</button>

				<div class="h-[55%] w-full relative">
					<img src="{activeDetail.img}" alt={activeDetail.title} class="w-full h-full object-cover" />
					<div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#e8e8e8]/90"></div>
				</div>

				<div class="h-[45%] w-full px-8 pt-2 pb-10 flex flex-col items-center text-center justify-start gap-4">
					<div class="w-12 h-1 bg-gray-400 rounded-full mb-4"></div>
					<h2 class="text-4xl secondary-font uppercase font-thin tracking-widest text-black">
						{activeDetail.title}
					</h2>

					<div class="w-16 h-[1px] bg-[#2d6f71]"></div>

					<p class="text-sm font-bold secondary-font uppercase tracking-wide text-gray-600 max-w-[80%] leading-relaxed">
						{activeDetail.desc}
					</p>

					<div class="mt-auto text-[10px] text-gray-400 uppercase tracking-widest">
						Tap backdrop to close
					</div>
				</div>
			</div>
		</div>
	{/if}
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

	/* Mobile Squircle Specifics */
	.mobile-squircle {
		will-change: transform;
		transform-style: preserve-3d;
	}

	@media (max-width: 768px) {
		.watch-container {
			padding: 1rem 0;
		}
	}
</style>