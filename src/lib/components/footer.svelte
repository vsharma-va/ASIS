<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let ctx;
	let footerContainer;

	gsap.registerPlugin(ScrollTrigger);

	onMount(() => {
		ctx = gsap.context(() => {
			gsap.set('.transform-3d', {
				y: 100,
				opacity: 0,
				force3D: true
			});

			gsap.set('.transform-letter', {
				y: 200,
				opacity: 0,
				force3D: true
			});

			ScrollTrigger.create({
				trigger: footerContainer,
				start: 'top+=280% top',
				end: 'bottom+=280% 15%',
				markers: false,
				onEnter: () => {

					const masterTl = gsap.timeline();

					const emailElements = gsap.utils.toArray('.top-text .transform-3d');
					masterTl.to(emailElements, {
						y: 0,
						opacity: 1,
						duration: 0.8,
						ease: 'power2.out',
						stagger: 0.2,
						force3D: true
					});

					const letters = gsap.utils.toArray('.transform-letter');
					const letterOrder = [1, 2, 0, 3];

					letterOrder.forEach((index, i) => {
						if (letters[index]) {
							masterTl.to(letters[index], {
								y: 0,
								opacity: 1,
								duration: 1,
								ease: 'power2.out',
								force3D: true
							}, 0.3 + (i * 0.15));
						}
					});


					const bottomElements = gsap.utils.toArray('.footer-para');
					masterTl.to(bottomElements, {
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
		if (ctx) {
			ctx.revert();
		}
		ScrollTrigger.getAll().forEach(trigger => trigger.kill());
	});
</script>

<div bind:this={footerContainer}
		 class="footer-container min-h-screen w-full bg-footer flex flex-col justify-center items-center
		 				py-4 gap-1 sm:gap-2 text-[#7CD1D3] px-4 sm:px-6 md:px-8">
	<!-- Top Section - Email -->
	<div class="top-text text-center uppercase leading-none h-auto w-full sm:w-3/4 overflow-hidden
						flex flex-col justify-end items-center mb-2 sm:mb-4 md:mb-0">
		<div
			class="h-auto w-full text-xs sm:text-sm secondary-font flex justify-center items-end overflow-hidden mb-1 sm:mb-0">
			<div class="transform-3d">
				e-mail
			</div>
		</div>
		<div
			class="h-auto w-full primary-font font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl flex justify-center items-end overflow-hidden">
			<div class="transform-3d email-underline">
				enquiry@asiswatches.com
			</div>
		</div>
	</div>

	<!-- Center Section - Large ASIS Text -->
	<div class="center-text flex items-center justify-center h-auto sm:h-[40%] w-full sm:w-3/4 overflow-hidden
							footer-font tracking-wider px-2 sm:px-4 my-4 sm:my-6 md:my-0
              text-[5rem] xs:text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[20rem] 2xl:text-[24rem]
              leading-none">
		<div class="transform-letter">A</div>
		<div class="transform-letter">S</div>
		<div class="transform-letter">I</div>
		<div class="transform-letter">S</div>
	</div>

	<!-- Bottom Section - Social Links and Copyright -->
	<div class="bottom-text text-center uppercase leading-none
							h-auto sm:h-1/3 w-full sm:w-3/4 overflow-hidden
							flex flex-col justify-center items-center mt-4 sm:mt-6 sm:-mb-4">
		<div class="w-full h-fit text-center capitalize primary-font text-sm sm:text-md mb-2
								footer-para translate-y-[200%] opacity-0">
			About us
		</div>
		<p class="footer-para h-fit w-full text-sm sm:text-base lg:text-sm tracking-normal secondary-font
								leading-relaxed translate-y-[200%] opacity-0">
			At ASIS Watches, we believe that time is a celebration of individuality. Our exquisite timepieces blend the
			artistry of watchmaking with the elegance of fine jewelry, creating unique expressions of style and
			sophistication.
			<br />
			Each ASIS watch is a meticulously crafted masterpiece, adorned with handpicked gemstones that ensure no two
			pieces are alike. Our designs are not just accessories; they embody your distinct style and reflect the luxury
			you carry every day.
			<br />
			We are committed to redefining traditional watch design, creating wearable works of art that inspire pride in
			their wearers. With every purchase, you support initiatives like Purple People Labs, which empower young
			storytellers to express their creativity and individuality.
			<br />
			Join us in celebrating time and artistry—because "You are unique as is."
		</p>
	</div>
</div>

<style>
    .bg-footer {
        background: #2D3E50;
    }

    .transform-3d,
    .transform-letter {
        will-change: transform;
        position: relative;
    }

    .email-underline {
        position: relative;
    }

    .email-underline::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 0.125rem;
        left: 0;
        bottom: -2px;
        background-color: #7CD1D3;
        transform-origin: bottom right;
        transform: scaleX(0);
        transition: transform 0.6s ease;
    }

    @media (min-width: 640px) {
        .email-underline::after {
            height: 0.25rem;
            bottom: -3px;
        }
    }

    @media (min-width: 768px) {
        .email-underline::after {
            height: 0.375rem;
            bottom: -4px;
        }
    }

    @media (min-width: 1024px) {
        .email-underline::after {
            height: 0.5rem;
            bottom: -4px;
        }
    }

    .email-underline:hover::after {
        transform-origin: bottom left;
        transform: scaleX(1);
    }

    /* Ensure proper spacing on mobile */
    @media (max-width: 640px) {
        .center-text {
            margin: 1rem 0;
        }

        .footer-container {
            min-height: 100vh;
            justify-content: space-evenly;
        }
    }

    /* Optimize for tablets */
    @media (min-width: 641px) and (max-width: 1023px) {
        .center-text {
            margin: 2rem 0;
        }
    }

    /* Desktop and up optimizations */
    @media (min-width: 1024px) {
        .footer-container {
            height: 100vh;
        }
    }
</style>