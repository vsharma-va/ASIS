<script>
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';
	import { openContactForm } from '$lib/stores/contactFormStore';

	export let csrLink = 'https://your-csr-page.com';

	gsap.registerPlugin(ScrollTrigger);
	onMount(() => {
		// Initial entrance animation for collaboration section
		let entranceTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.combined-section',
				start: 'top-=45% center',
				end: 'top center',
				scrub: 2,
				markers: false
			}
		});
		entranceTimeline.to('.animate-title', {
			y: 0,
			opacity: 1,
			ease: 'power2.inOut',
			stagger: 0.2,
			duration: 2
		})
			.to('.animate-paragraph', {
				y: 0,
				opacity: 1,
				ease: 'power2.inOut',
				duration: 2
			})
			.to('.animate-cta', {
				y: 0,
				opacity: 1,
				ease: 'power2.inOut',
				duration: 2
			});

		// Transition animation from collaboration to CSR
		let transitionTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.combined-section',
				start: 'center center',
				end: 'bottom top',
				scrub: 2,
				markers: false
			}
		});

		// Fade out and move collaboration content
		transitionTimeline
			.to('.collaboration-content', {
				opacity: 0,
				y: -50,
				ease: 'power2.inOut',
				duration: 1
			}, 0)
			// Fade in and move CSR content
			.fromTo('.csr-content', {
				opacity: 0,
				y: 50
			}, {
				opacity: 1,
				y: 0,
				ease: 'power2.inOut',
				duration: 1
			}, 0);

		// Subtle pulse animation for the arrows
		gsap.to('.arrow-icon', {
			y: 5,
			duration: 1,
			repeat: -1,
			yoyo: true,
			ease: 'power1.inOut'
		});
	});
</script>

<div class="combined-section h-[180vh] w-full relative flex justify-center items-start bg-gradient pb-6 sm:pb-10">
	<div class="sticky top-0 h-screen w-full flex justify-center items-center">
		<div class="center-text w-[95%] sm:w-4/5 lg:w-3/5 xl:w-2/4 h-full overflow-hidden
			flex flex-col justify-center items-center text-black text-center px-4 sm:px-0 relative">

			<!-- COLLABORATION CONTENT -->
			<div class="collaboration-content absolute inset-0 flex flex-col justify-center items-center">
				<!-- Header section -->
				<div class="header-section mb-8 sm:mb-12 lg:mb-16 relative text-center w-full overflow-hidden">
					<button
						on:click={openContactForm}
						class="group animate-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl primary-font leading-tight capitalize
							translate-y-[110%] opacity-0 cursor-pointer transition-all duration-300 relative
							hover:scale-105 active:scale-95">
						Collaborate with us
						<!-- Underline effect -->
						<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black
							group-hover:w-full transition-all duration-500 ease-out"></span>
					</button>
					<p class="animate-title text-xs sm:text-sm tracking-tight secondary-font translate-y-full opacity-0 mt-2">
						Become A Wholesaler & Distributor
					</p>

					<!-- Call-to-action button with arrow -->
					<button
						on:click={openContactForm}
						class="animate-cta mt-6 inline-flex items-center gap-2 px-6 py-3 bg-black text-white
							rounded-full hover:bg-gray-800 transition-all duration-300 translate-y-[110%] opacity-0
							hover:gap-3 group shadow-lg hover:shadow-xl">
						<span class="text-sm sm:text-base font-medium">Get in Touch</span>
						<svg
							class="arrow-icon w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								  d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</button>
				</div>

				<!-- Changing content section -->
				<div class="changingTextContainer w-full">
					<div class="para-wrapper overflow-hidden w-full">
						<p
							class="animate-paragraph w-full text-sm sm:text-base lg:text-lg tracking-normal secondary-font
								leading-relaxed translate-y-[110%] opacity-0">
							Join us in celebrating individuality and craftsmanship by partnering with ASIS Watches as a
							wholesaler or
							distributor. Our exquisite timepieces are not just watches; they are wearable art,
							meticulously
							crafted to
							resonate with style and sophistication.By becoming a part of our network, you'll offer your
							customers unique,
							high-quality products while benefiting from our after sales support.
						</p>
					</div>
				</div>
			</div>

			<!-- CSR CONTENT -->
			<div class="csr-content absolute inset-0 flex flex-col justify-center items-center opacity-0">
				<!-- Header section -->
				<div class="header-section mb-8 sm:mb-12 lg:mb-16 relative text-center w-full overflow-hidden">
					<a
						href={csrLink}
						target="_blank"
						rel="noopener noreferrer"
						class="group text-3xl sm:text-4xl md:text-5xl lg:text-6xl primary-font leading-tight capitalize
							transition-all duration-300 relative block
							hover:scale-105 active:scale-95">
						Corporate Social Responsibility
						<!-- Underline effect -->
						<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black
							group-hover:w-full transition-all duration-500 ease-out"></span>
					</a>
					<p class="text-xs sm:text-sm tracking-tight secondary-font mt-2">
						Making A Difference Together
					</p>

					<!-- Call-to-action button with arrow -->
					<a
						href={csrLink}
						target="_blank"
						rel="noopener noreferrer"
						class="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-black text-white
							rounded-full hover:bg-gray-800 transition-all duration-300
							hover:gap-3 group shadow-lg hover:shadow-xl">
						<span class="text-sm sm:text-base font-medium">Learn More</span>
						<svg
							class="arrow-icon w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								  d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</a>
				</div>

				<!-- Content section -->
				<div class="changingTextContainer w-full">
					<div class="para-wrapper overflow-hidden w-full">
						<p
							class="w-full text-sm sm:text-base lg:text-lg tracking-normal secondary-font
								leading-relaxed">
							At ASIS Watches, we believe in giving back to the communities that inspire us. Our
							commitment
							to corporate social responsibility goes beyond creating exceptional timepieces. We actively
							support initiatives that promote sustainability, empower local artisans, and contribute to
							meaningful social causes. Through ethical sourcing, environmental consciousness, and
							community
							partnerships, we strive to make a positive impact while crafting watches that stand the test
							of time.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>