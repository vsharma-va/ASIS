<script>
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';

	gsap.registerPlugin(ScrollTrigger);
	onMount(() => {
		let timeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.collection-section',
				start: 'top center-=25%',
				end: 'bottom bottom+=25%',
				scrub: 2,
				markers: false
			}
		});
		timeline.to('.animate-title', {
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
			});
	});
</script>

<div class="collection-section h-[110vh] w-full relative flex justify-center items-center bg-gradient pb-6 sm:pb-10">
	<div class="collection-center-text w-[95%] sm:w-4/5 lg:w-3/5 xl:w-2/4 h-full overflow-hidden
        flex flex-col justify-center items-center text-black text-center px-4 sm:px-0">
		<!-- Header section -->
		<div class="header-section mb-8 sm:mb-12 lg:mb-16 relative text-center w-full overflow-hidden">
			<h1 class="animate-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl primary-font leading-tight capitalize
								translate-y-[110%] opacity-0">
				Collaborate with us
			</h1>
			<p class="animate-title text-xs sm:text-sm tracking-tight secondary-font translate-y-full opacity-0">
				Become A Wholesaler & Distributor
			</p>
		</div>

		<!-- Changing content section -->
		<div class="changingTextContainer w-full">
			<div class="para-wrapper overflow-hidden w-full">
				<p
					class="animate-paragraph w-full text-sm sm:text-base lg:text-lg tracking-normal secondary-font
								leading-relaxed translate-y-[110%] opacity-0">
					Join us in celebrating individuality and craftsmanship by partnering with ASIS Watches as a wholesaler or
					distributor. Our exquisite timepieces are not just watches; they are wearable art, meticulously crafted to
					resonate with style and sophistication.By becoming a part of our network, you’ll offer your customers unique,
					high-quality products while benefiting from our after sales support.
				</p>
			</div>
		</div>
	</div>
</div>