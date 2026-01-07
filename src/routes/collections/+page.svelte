<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import {
		registerComponent,
		unregisterComponent,
		setComponentReady
	} from '$lib/stores/loadingStore';
	import { getAllWatches } from '$lib/stores/watchData';
	import { goto } from '$app/navigation';

	let watches = getAllWatches().filter((w) => w.isEnabled);

	const fallbackTimers = new Map();
	const IMAGE_FALLBACK_MS = 7000;
	const compName = (id) => `watch-image-${id}`;

	function imageLoaded(id) {
		const name = compName(id);
		const t = fallbackTimers.get(id);
		if (t) {
			clearTimeout(t);
			fallbackTimers.delete(id);
		}
		setComponentReady(name, true);
	}

	onMount(() => {
		for (const w of watches) {
			const name = compName(w.id);
			registerComponent(name);
			const t = setTimeout(() => {
				setComponentReady(name, true);
				fallbackTimers.delete(w.id);
			}, IMAGE_FALLBACK_MS);
			fallbackTimers.set(w.id, t);
		}
	});

	onDestroy(() => {
		for (const w of watches) {
			const t = fallbackTimers.get(w.id);
			if (t) clearTimeout(t);
			fallbackTimers.delete(w.id);
			unregisterComponent(compName(w.id));
		}
	});

	// --- GSAP Zoom Logic (New) ---
	function handleMouseEnter(e) {
		const container = e.currentTarget;
		const img = container.querySelector('.zoom-target');

		if (!img) return;

		// Luxurious, slow zoom
		gsap.to(img, {
			duration: 1.5,
			scale: 1.08,
			ease: "power2.out",
			overwrite: "auto"
		});
	}

	function handleMouseLeave(e) {
		const container = e.currentTarget;
		const img = container.querySelector('.zoom-target');

		if (!img) return;

		// Smooth return to normal
		gsap.to(img, {
			duration: 1,
			scale: 1,
			ease: "power2.out",
			overwrite: "auto"
		});
	}

	function landingImageFor(w) {
		if (w.landingImage) return w.landingImage;
		if (w.variants && w.variants.length && w.variants[0].images && w.variants[0].images.length)
			return w.variants[0].images[0];
		return null;
	}

	function priceFor(w) {
		const vSpec = Array.isArray(w.specs) ? w.specs.find((s) => String(s.label).toLowerCase().includes('variant')) : null;
		if (vSpec && vSpec.value) return vSpec.value;
		if (w.variants) return `${w.variants.length} Variations`;
		return '';
	}

	function specsList(w) {
		if (!w.specs) return [];
		return w.specs.map((s) => (typeof s === 'string' ? s : `${s.label}: ${s.value}`));
	}
</script>

<div class="relative min-h-screen bg-[#EAE8E4] text-black overflow-x-hidden selection:bg-stone-800 selection:text-[#E2D9DC]">

	<main class="flex flex-col w-full">

		<section class="relative min-h-[80vh] w-full flex flex-col justify-center items-center px-6 py-24 bg-[#EAE8E4] overflow-hidden">

			<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none"></div>

			<div class="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">

				<div class="w-px h-16 md:h-24 bg-stone-800/20 mb-8 opacity-0 animate-fade-in-up"></div>

				<h1 class="footer-font text-stone-900 leading-[0.8] tracking-tighter opacity-0 animate-fade-in-up animation-delay-200 mb-12 md:mb-16"
					style="font-size: clamp(3.5rem, 13vw, 10rem);">
					COLLECTIONS
				</h1>

				<div class="space-y-6 md:space-y-8 max-w-2xl px-2 md:px-0 opacity-0 animate-fade-in-up animation-delay-400">

					<p class="secondary-font text-xs md:text-sm uppercase tracking-[0.15em] leading-7 md:leading-8 text-stone-600 font-medium">
						At AS - IS Watches, our collections are a tribute to individuality and artistry. Each line features meticulously crafted timepieces that showcase handpicked natural gemstones, ensuring that no two watches are alike.
					</p>

					<div class="flex justify-center py-2">
						<span class="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
					</div>

					<p class="secondary-font text-xs md:text-sm uppercase tracking-[0.15em] leading-7 md:leading-8 text-stone-500 font-light">
						From elegant classics to bold statement pieces, our collections cater to every style and occasion. Discover the perfect watch that resonates with your essence, and wear a piece of art that tells your unique story.
					</p>

					<p class="secondary-font text-xs md:text-sm uppercase tracking-[0.15em] leading-7 md:leading-8 text-stone-800 font-medium border-t border-b border-stone-800/10 py-6 mt-4">
						Embrace your individuality with every tick of an AS - IS watch.
					</p>

				</div>

				<div class="mt-16 opacity-0 animate-fade-in-up animation-delay-600 hidden md:flex flex-col items-center gap-2">
					<div class="w-px h-12 bg-stone-400/30"></div>
				</div>

			</div>
		</section>

		{#each watches as watch, i}
			<section class="relative w-full flex flex-col lg:grid lg:grid-cols-2 group overflow-hidden border-t border-stone-800/5 bg-gradient-to-b from-[#EAE8E4] to-[#F2F1EF]">

				<div class="relative flex flex-col justify-center px-6 py-16 md:px-12 lg:p-24 order-1 {i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} z-20">

					<div class="relative backdrop-blur-md bg-white/40 p-6 md:p-10 lg:p-12 rounded-sm border border-white/40 shadow-sm transition-transform duration-700 lg:hover:-translate-y-2">

						<div class="space-y-6 md:space-y-10">
							<div class="space-y-3 md:space-y-4">
								<div class="flex items-center gap-3 opacity-60">
									<span class="h-px w-8 bg-stone-800"></span>
									<span class="secondary-font text-[10px] md:text-xs uppercase tracking-[0.25em] text-stone-800">
                               Collection 0{i+1}
                            </span>
								</div>
								<h3 class="primary-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9] text-stone-900">
									{watch.collection}
								</h3>
								<p class="primary-font text-lg sm:text-xl md:text-2xl italic text-stone-600 font-light pl-1">
									"{watch.subCollection || watch.title}"
								</p>
							</div>

							<div class="py-4 md:py-6 border-t border-stone-800/10">
								<ul class="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-2 md:gap-y-3 secondary-font text-[12px] md:text-[13px] uppercase tracking-widest text-stone-500">
									{#each specsList(watch).slice(0, 4) as spec}
										<li class="flex items-center gap-2">
											<span class="w-1 h-1 bg-stone-400 rounded-full"></span>
											{spec}
										</li>
									{/each}
								</ul>
							</div>

							<p class="secondary-font text-xs md:text-sm leading-loose text-stone-800 font-light text-justify max-w-md">
								{watch.watchDescription}
							</p>

							<div class="flex items-center gap-6 pt-2 md:pt-4">
								<button
									on:click={() => goto(`/watches/${watch.id}/`)}
									class="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-stone-900 text-[#E2D9DC] shadow-lg transition-transform duration-300 active:scale-95 lg:hover:scale-110 lg:hover:bg-black group/btn">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="lg:group-hover/btn:-rotate-45 transition-transform duration-300 scale-90 md:scale-100">
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
								</button>
								<span class="footer-font-alt text-2xl md:text-3xl lg:text-4xl text-stone-900">
                            {priceFor(watch)}
                         </span>
							</div>
						</div>
					</div>
				</div>

				<div class="relative w-full min-h-[50vh] lg:h-auto lg:min-h-screen order-2 {i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} flex items-center justify-center z-10 py-12 lg:py-0">

					<div class="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
                    <span class="footer-font text-[40vw] lg:text-[25vw] leading-none text-stone-900/[0.04] lg:text-stone-900/[0.03] scale-150 transition-transform duration-1000 lg:group-hover:scale-125 lg:group-hover:rotate-6">
                        0{i+1}
                    </span>
					</div>

					<div
						class="hidden lg:flex relative w-full h-full items-center justify-center"
						on:mouseenter={handleMouseEnter}
						on:mouseleave={handleMouseLeave}
						role="img"
					>
						{#if landingImageFor(watch)}
							<img
								src={landingImageFor(watch)}
								alt={watch.collection}
								class="zoom-target w-[85%] max-w-none h-auto object-contain drop-shadow-2xl will-change-transform"
								on:load={() => imageLoaded(watch.id)}
								on:error={() => imageLoaded(watch.id)}
							/>
						{:else}
							<img src="" alt="" class="zoom-target w-full h-auto" />
						{/if}
					</div>

					<div class="lg:hidden relative w-full h-[60vh] sm:h-[70vh] flex items-center justify-center">
						{#if landingImageFor(watch)}
							<img
								src={landingImageFor(watch)}
								alt={watch.collection}
								class="absolute w-[65vh] sm:w-[80vh] max-w-none h-auto -rotate-90 object-contain drop-shadow-xl"
								on:load={() => imageLoaded(watch.id)}
								on:error={() => imageLoaded(watch.id)}
							/>
						{:else}
							<img src="" alt="" class="w-full h-full object-contain" />
						{/if}
					</div>

				</div>

			</section>
		{/each}
	</main>
</div>

<style>
	/* Styling */
	.bg-gradient-custom {
		background: linear-gradient(90deg, #E2D9DC 0%, #DED5D8 50%, #B9B0B3 100%);
	}

	:global(html) {
		scroll-behavior: smooth;
		background-color: #EAE8E4;
	}

	/* Enhanced Shadow */
	img {
		filter: drop-shadow(0 25px 45px rgba(0,0,0,0.15));
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.animation-delay-200 { animation-delay: 0.2s; }
	.animation-delay-400 { animation-delay: 0.4s; }
	.animation-delay-600 { animation-delay: 0.6s; }
</style>