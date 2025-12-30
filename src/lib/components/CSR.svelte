<script>
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';

	// You can make this a prop if you want it to be configurable
	export let csrLink = 'https://your-csr-page.com'; // Replace with your actual CSR page URL

	gsap.registerPlugin(ScrollTrigger);
	onMount(() => {
		let timeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.csr-section',
				start: 'top-=45% center',
				end: 'bottom bottom+=25%',
				scrub: 2,
				markers: false
			}
		});
		timeline.to('.animate-csr-title', {
			y: 0,
			opacity: 1,
			ease: 'power2.inOut',
			stagger: 0.2,
			duration: 2
		})
			.to('.animate-csr-paragraph', {
				y: 0,
				opacity: 1,
				ease: 'power2.inOut',
				duration: 2
			})
			.to('.animate-csr-cta', {
				y: 0,
				opacity: 1,
				ease: 'power2.inOut',
				duration: 0.5
			},"<");
	});
</script>

<div class="csr-section h-[90vh] w-full relative flex justify-center items-center bg-gradient pb-6 sm:pb-10">
	<div class="csr-center-text w-[95%] sm:w-4/5 lg:w-3/5 xl:w-2/4 h-full overflow-hidden
        flex flex-col justify-center items-center text-black text-center px-4 sm:px-0">
		<!-- Header section -->
		<div class="header-section mb-8 sm:mb-12 lg:mb-16 relative text-center w-full overflow-hidden">
			<a
				href={csrLink}
				target="_blank"
				rel="noopener noreferrer"
				class="group animate-csr-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl primary-font leading-tight capitalize
                    translate-y-[110%] opacity-0 transition-all duration-300 relative block
                    hover:scale-105 active:scale-95">
				Corporate Social Responsibility
				<!-- Underline effect -->
				<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black
                          group-hover:w-full transition-all duration-500 ease-out"></span>
			</a>
			<p class="animate-csr-title text-xs sm:text-sm tracking-tight secondary-font translate-y-full opacity-0 mt-2">
				Making A Difference Together
			</p>

			<!-- Call-to-action button with arrow -->
			<a
				href={csrLink}
				target="_blank"
				rel="noopener noreferrer"
				class="animate-csr-cta mt-6 inline-flex items-center gap-2 px-6 py-3 bg-black text-white
                    rounded-full hover:bg-gray-800 transition-all duration-300 translate-y-[110%] opacity-0
                    hover:gap-3 group shadow-lg hover:shadow-xl">
				<span class="text-sm sm:text-base font-medium">Learn More</span>
				<svg
					class="csr-arrow-icon w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
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
					class="animate-csr-paragraph w-full text-sm sm:text-base lg:text-lg tracking-normal secondary-font
                         leading-relaxed translate-y-[110%] opacity-0">
					At ASIS Watches, we believe in giving back to the communities that inspire us. Our commitment
					to corporate social responsibility goes beyond creating exceptional timepieces. We actively
					support initiatives that promote sustainability, empower local artisans, and contribute to
					meaningful social causes. Through ethical sourcing, environmental consciousness, and community
					partnerships, we strive to make a positive impact while crafting watches that stand the test
					of time.
				</p>
			</div>
		</div>
	</div>
</div>