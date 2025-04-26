<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	onMount(() => {
		const textElements = gsap.utils.toArray([
			'.top-text .transform-3d',
			'.bottom-text .transform-3d'
		]);

		textElements.forEach(element => {
			gsap.to(element, {
				y: 0,
				duration: 1.2,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.footer-container',
					start: 'top 80%',
					toggleActions: 'play pause resume reset'
				}
			});
		});

		const letters = gsap.utils.toArray('.center-text > div');
		const letterOrder = [1, 2, 0, 3];

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '.footer-container',
				start: 'top 70%',
				toggleActions: 'play pause resume reset'
			}
		});


		letterOrder.forEach((index, i) => {
			if (letters[index]) {
				tl.to(letters[index], {
					y: 0,
					duration: 1.4,
					ease: 'power2.out'
				}, i * 0.15);
			}
		});


	});
</script>

<div
	class="footer-container h-screen w-full bg-footer flex flex-col justify-center items-center py-8 gap-2 text-[#7CD1D3]">
	<div
		class="top-text text-center uppercase leading-none h-1/4 w-3/4 overflow-hidden flex flex-col justify-end items-center">
		<div class="h-1/6 w-full text-xs secondary-font flex justify-center items-end overflow-hidden">
			<div class="transform-3d translate-y-full">
				e-mail
			</div>
		</div>
		<div
			class="h-1/6 w-full primary-font font-bold text-2xl flex justify-center items-end overflow-hidden">
			<div class="transform-3d translate-y-full email-underline">
				asis.co@gmail.com
			</div>
		</div>
	</div>

	<div
		class="center-text flex items-center justify-center h-1/2 w-3/4 overflow-hidden footer-font text-[28rem] tracking-wider">
		<div class="transform translate-y-full">A</div>
		<div class="transform translate-y-full">S</div>
		<div class="transform translate-y-full">I</div>
		<div class="transform translate-y-full">S</div>
	</div>

	<div
		class="bottom-text text-center uppercase leading-none h-1/4 w-3/4 overflow-hidden flex flex-col justify-start items-center">
		<div
			class="h-1/5 w-full primary-font font-bold tracking-wide text-2xl flex justify-center items-start overflow-hidden">
			<div class="transform-3d translate-y-full email-underline cursor-pointer">
				INSTAGRAM
			</div>
			<div class="transform-3d translate-y-full">
				&nbsp; * &nbsp;
			</div>
			<div class="transform-3d translate-y-full email-underline cursor-pointer">
				WhatsApp
			</div>
		</div>
		<div class="h-1/6 w-full text-sm secondary-font flex justify-center items-start overflow-hidden">
			<div class="transform-3d translate-y-[120%]">
				@2025 ASIS
			</div>
		</div>
	</div>
</div>

<style>
    .bg-footer {
        background: #2D3E50;
    }

    .transform-3d {
        will-change: transform;
        transform: translateY(100%);
        transform-style: preserve-3d;
    }

    .center-text > div {
        will-change: transform;
        transform: translateY(100%);
        transition: transform 0.01s;
    }

    .email-underline::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 0.5rem;
        left: 0;
        bottom: -4px;
        background-color: #7CD1D3;
        transform-origin: bottom right;
        transform: scaleX(0);
        transition: transform 0.8s;
    }

    .email-underline:hover::after {
        transform-origin: bottom left;
        transform: scaleX(1);
    }
</style>