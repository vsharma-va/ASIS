<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import AsisLogo from '$lib/assets/images/AS IS.png';

	let footerContainer;
	let storyOverlay;
	let isStoryOpen = false;
	let ctx;

	function openStory() {
		isStoryOpen = true;

		gsap.timeline()
			.to(storyOverlay, {
				opacity: 1,
				duration: 0.4,
				ease: 'power2.inOut'
			})
			.to('.story-content',
				{ y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
				0.2
			)
			.to('.story-text',
				{ y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
				0.4
			);
	}

	function closeStory() {
		gsap.timeline()
			.to('.story-text', {
				y: -20,
				opacity: 0,
				duration: 0.3,
				stagger: 0.05,
				ease: 'power2.in'
			})
			.to('.story-content', {
				y: 30,
				opacity: 0,
				duration: 0.4,
				ease: 'power2.in'
			}, 0.1)
			.to(storyOverlay, {
				opacity: 0,
				duration: 0.3,
				ease: 'power2.inOut',
				onComplete: () => {
					isStoryOpen = false;
				}
			});
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.to(footerContainer.children, {
			y: 0,
			opacity: 1,
			duration: 1,
			stagger: 0.2,
			ease: "power3.out",
			delay: 0.5
		});

		ctx = gsap.context(() => {
			gsap.set('.transform-3d', {
				y: 100,
				opacity: 0,
				force3D: true
			});

			ScrollTrigger.create({
				trigger: footerContainer,
				start: 'top-=10% center',
				end: 'bottom bottom',
				markers: false,
				onEnter: () => {
					const tl = gsap.timeline();

					tl.to(gsap.utils.toArray('.top-text .transform-3d'), {
						y: 0,
						opacity: 1,
						duration: 0.8,
						ease: 'power2.inOut',
						stagger: 0.2,
						force3D: true
					});

					tl.to('.center-text .transform-3d', {
						y: 0,
						opacity: 1,
						duration: 1,
						ease: 'power2.inOut',
						force3D: true
					}, 0.3);

					tl.to(gsap.utils.toArray('.footer-para'), {
						y: 0,
						opacity: 1,
						duration: 0.8,
						ease: 'power2.inOut',
						stagger: 0.1,
						force3D: true
					}, 0.8);
				}
			});
		}, footerContainer);
	});

	onDestroy(() => {
		if(ctx) ctx.revert();
	});
</script>

<div bind:this={footerContainer} class="footer-container min-h-screen w-full bg-footer flex flex-col justify-center items-center
          py-4 gap-1 sm:gap-2 text-[#7CD1D3] px-4 sm:px-6 md:px-8 relative">

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
		<div class="footer-para translate-y-[200%] opacity-0 w-full capitalize primary-font text-lg sm:text-xl md:text-2xl mb-2">
			About us
		</div>
		<p class="footer-para translate-y-[200%] opacity-0 h-auto w-full text-sm sm:text-base leading-relaxed secondary-font mb-6">
			At AS‑IS Watches, we believe every person is unique — and your watch should be too. Inspired by the love and wisdom passed down through generations, we create jewellery watches that celebrate individuality. Each piece is crafted with natural gemstones, making every watch slightly different and truly personal.
			We blend fine jewellery with precise watchmaking to create timepieces that feel special, meaningful, and full of character. With every AS‑IS watch sold, we also support community initiatives that help young creators grow.
			AS‑IS Watches — because you are unique, as is.
		</p>

		<!-- Read Our Story Button -->
		<button
			on:click={openStory}
			class="footer-para translate-y-[200%] opacity-0 story-button mt-4 px-8 py-3 border-2 border-[#7CD1D3] text-[#7CD1D3] uppercase tracking-wider text-sm font-medium hover:bg-[#7CD1D3] hover:text-[#2D3E50] transition-all duration-300 ease-out"
		>
			Read Our Story
		</button>
	</div>
	{#if isStoryOpen}
		<div
			bind:this={storyOverlay}
			class="story-overlay absolute top-0 inset-0 z-[999] bg-white flex items-center justify-center p-4"
			on:click={closeStory}
		>
			<div
				class="story-content relative translate-y-[-50px] bg-[#2D3E50] border-2 border-[#7CD1D3] max-w-3xl w-full max-h-[85vh] overflow-y-auto p-8 sm:p-12"
				on:click|stopPropagation
			>
				<!-- Close Button -->
				<button
					on:click={closeStory}
					class="absolute top-4 right-4 text-[#7CD1D3] hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center transition-colors duration-200"
					aria-label="Close"
				>
					×
				</button>

				<!-- Story Content -->
				<div class="text-[#7CD1D3]">
					<h2 class="story-text primary-font text-3xl sm:text-4xl font-bold mb-8 uppercase text-center">
						Our Story
					</h2>

					<div class="space-y-6 secondary-font text-base sm:text-lg leading-relaxed">
						<p class="story-text">
							At AS‑IS Watches, we believe every person is unique — and your watch should be too. Inspired by the love and wisdom passed down through generations, we create jewellery watches that celebrate individuality. Each piece is crafted with natural gemstones, making every watch slightly different and truly personal.
						</p>

						<p class="story-text">
							We blend fine jewellery with precise watchmaking to create timepieces that feel special, meaningful, and full of character. With every AS‑IS watch sold, we also support community initiatives that help young creators grow.
						</p>

						<p class="story-text">
							Our journey began with a simple idea: that time is personal. Every moment, every memory, every milestone deserves to be marked with something that reflects who you are. We don't believe in mass production or cookie-cutter designs. Instead, we embrace the beautiful imperfections that make each gemstone — and each person — unique.
						</p>

						<p class="story-text">
							Each AS‑IS watch is a collaboration between master craftsmen and nature itself. The gemstones we use tell their own stories, formed over millennia deep within the earth. When you wear an AS‑IS watch, you're not just wearing a timepiece — you're carrying a piece of the earth's history, combined with human artistry and precision.
						</p>

						<p class="story-text">
							We're committed to creating not just beautiful watches, but a beautiful impact. That's why a portion of every sale goes directly to supporting young creators and artisans in our community, helping them develop their craft and share their unique voice with the world.
						</p>

						<p class="story-text primary-font text-xl font-bold text-center mt-8">
							AS‑IS Watches — because you are unique, as is.
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Story Overlay -->


<style>
	.bg-footer {
		background: #2D3E50;
	}

	.transform-3d {
		will-change: transform;
		position: relative;
	}

	.story-button {
		position: relative;
		overflow: hidden;
	}

	.story-button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: #7CD1D3;
		transform: translate(-50%, -50%);
		transition: width 0.4s ease-out, height 0.4s ease-out;
		z-index: -1;
	}

	.story-button:hover::before {
		width: 300%;
		height: 300%;
	}

	.story-overlay {
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(8px);
	}

	.story-content {
		box-shadow: 0 25px 50px -12px rgba(124, 209, 211, 0.25);
	}

	.story-content::-webkit-scrollbar {
		width: 8px;
	}

	.story-content::-webkit-scrollbar-track {
		background: rgba(124, 209, 211, 0.1);
	}

	.story-content::-webkit-scrollbar-thumb {
		background: #7CD1D3;
		border-radius: 4px;
	}

	.story-content::-webkit-scrollbar-thumb:hover {
		background: rgba(124, 209, 211, 0.8);
	}
</style>