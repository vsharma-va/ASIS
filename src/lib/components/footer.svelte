<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import AsisLogo from '$lib/assets/images/AS IS.png'; // replace with your image path

	let ctx;
	let footerContainer;

	gsap.registerPlugin(ScrollTrigger);

	onMount(() => {
		ctx = gsap.context(() => {
			// initial state for email/text and image
			gsap.set('.transform-3d', {
				y: 100,
				opacity: 0,
				force3D: true
			});

			ScrollTrigger.create({
				trigger: footerContainer,
				start: 'top+=270% top',
				end: 'bottom+=280% 15%',
				markers: false,
				onEnter: () => {
					const tl = gsap.timeline();

					// animate email
					tl.to(gsap.utils.toArray('.top-text .transform-3d'), {
						y: 0,
						opacity: 1,
						duration: 0.8,
						ease: 'power2.out',
						stagger: 0.2,
						force3D: true
					});

					// animate logo
					tl.to('.center-text .transform-3d', {
						y: 0,
						opacity: 1,
						duration: 1,
						ease: 'power2.out',
						force3D: true
					}, 0.3);

					// animate bottom
					tl.to(gsap.utils.toArray('.footer-para'), {
						y: 0,
						opacity: 1,
						duration: 0.8,
						ease: 'power2.out',
						stagger: 0.1,
						force3D: true
					}, 0.8);
				}
			});

		}, footerContainer);
	});

	onDestroy(() => {
		if (ctx) ctx.revert();
		ScrollTrigger.getAll().forEach(t => t.kill());
	});
</script>

<div bind:this={footerContainer} class="footer-container min-h-screen w-full bg-footer flex flex-col justify-center items-center
			py-4 gap-1 sm:gap-2 text-[#7CD1D3] px-4 sm:px-6 md:px-8">

	<!-- Top Section - Email -->
	<div class="top-text text-center uppercase leading-none w-full sm:w-3/4 overflow-hidden flex flex-col justify-end items-center mb-4">
		<div class="transform-3d h-auto w-full text-xs sm:text-sm secondary-font flex justify-center items-end mb-1">
			e-mail
		</div>
		<div class="transform-3d h-auto w-full primary-font font-bold text-lg sm:text-xl md:text-2xl flex justify-center items-end">
			enquiry@asiswatches.com
		</div>
	</div>

	<!-- Center Section - Logo Image -->
	<div class="center-text flex items-center justify-center w-full sm:w-3/4 overflow-hidden my-6">
		<img
			src={AsisLogo}
			alt="ASIS Watches Logo"
			class="transform-3d w-[90%] xs:w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[45%] 2xl:w-[40%] h-auto"
		/>
	</div>

	<!-- Bottom Section - Description -->
	<div class="bottom-text text-center uppercase w-full sm:w-3/4 overflow-hidden flex flex-col justify-center items-center mt-6">
		<div class="footer-para translate-y-[200%] opacity-0 w-full capitalize primary-font text-sm sm:text-md mb-2">
			About us
		</div>
		<p class="footer-para translate-y-[200%] opacity-0 h-auto w-full text-sm sm:text-base leading-relaxed secondary-font">
			At ASIS Watches, we believe that time is a celebration of individuality. Our exquisite timepieces blend the artistry of watchmaking with the elegance of fine jewelry.
			Each ASIS watch is a meticulously crafted masterpiece, adorned with handpicked gemstones that ensure no two pieces are alike.
			We are committed to redefining traditional watch design, creating wearable works of art that inspire pride in their wearers.
			<br />Join us in celebrating time and artistry—because "You are unique as is."
		</p>
	</div>
</div>

<style>
    .bg-footer { background: #2D3E50; }
    .transform-3d { will-change: transform; position: relative; }
    .footer-container { /* mobile fallback */ }
</style>
