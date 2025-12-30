<script>
	import { onMount, onDestroy } from 'svelte';
	import {
		registerComponent,
		unregisterComponent,
		setComponentReady
	} from '$lib/stores/loadingStore';
	import { getAllWatches } from '$lib/stores/watchData';
	import { goto } from '\$app/navigation';

	let watches = getAllWatches().filter((w) => w.isEnabled);
	console.log('Loaded watches:', watches);

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

<div
	class="relative min-h-screen bg-gradient-custom text-black overflow-x-hidden selection:bg-stone-800 selection:text-[#E2D9DC]">

	<main class="flex flex-col w-full">

		<section
			class="min-h-screen w-full flex flex-col justify-center items-center relative px-6 md:px-24 py-24 md:py-32">
			<div class="text-center relative z-10 flex flex-col items-center">
				<div class="w-px h-16 bg-stone-800 mb-8 md:hidden"></div>
				<h2 class="footer-font text-[16vw] md:text-[15vw] leading-[0.85] text-stone-800 select-none tracking-tighter">
					AS-IS<br />COLLECTIONS
				</h2>
				<div class="mt-8 md:mt-12 max-w-md mx-auto">
					<p class="secondary-font text-base md:text-xl italic text-stone-600 leading-relaxed font-light">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
					</p>
				</div>
			</div>
		</section>

		{#each watches as watch, i}
			<section
				class="min-h-screen w-full flex items-center justify-center relative px-0 md:px-0 py-16 md:py-24 group transition-all duration-700
                'border-t border-stone-800/5">

				<div
					class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span class="footer-font text-[30vw] whitespace-nowrap blur-[1px]
                   text-stone-400/5 md:text-stone-400/10">
                   {watch.collection.split(" ")[1]}
                </span>
				</div>

				<div
					class="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center relative z-10 pb-12 md:pb-0">

					<div
						class="md:col-span-4 text-center md:text-right order-1 flex flex-col items-center md:items-end space-y-5 md:space-y-6 px-6 md:px-0">

						<div
							class="border border-stone-800/30 text-stone-800 px-5 py-1.5 rounded-full secondary-font text-[10px] md:text-xs tracking-widest uppercase inline-block mb-2 md:bg-stone-800 md:text-[#E2D9DC] md:border-none md:shadow-lg">
							Collection No. 0{i + 1}
						</div>

						<h3 class="primary-font text-5xl sm:text-6xl md:text-6xl lg:text-7xl leading-[0.9]
                      text-stone-900">
							{watch.collection}
						</h3>

						<p class="primary-font text-lg md:text-xl italic max-w-xs md:ml-auto font-light text-stone-600">
							"{watch.subCollection || watch.title}"
						</p>

						<ul class="w-full flex flex-wrap justify-center gap-x-4 gap-y-2 md:block md:w-auto secondary-font text-[10px] uppercase tracking-widest md:space-y-2 md:pr-4 pt-4 md:pt-4 border-t mt-2 md:mt-0
                      'text-stone-500 border-stone-800/10 md:border-r border-stone-400">
							{#each specsList(watch) as spec, j}
								<li class="whitespace-nowrap flex items-center justify-center md:justify-end">
									{spec}
									{#if j < specsList(watch).length - 1}
										<span class="md:hidden mx-2 opacity-50">•</span>
									{/if}
								</li>
							{/each}
						</ul>
					</div>

					<div class="md:col-span-4 order-2 flex justify-center items-center relative py-4 md:py-0 w-full">
						<div class="relative overflow-hidden w-[85vw] h-[115vw] max-h-[65vh] md:w-[28vw] md:h-[35vw] md:max-h-none transition-transform duration-500 hover:scale-[1.02] bg-stone-300
                         shadow-[0_15px_40px_rgba(0,0,0,0.15)] md:shadow-[0_20px_50px_rgba(0,0,0,0.2)]">

							{#if landingImageFor(watch)}
								<img
									src={landingImageFor(watch)}
									alt={watch.collection}
									class="rotated-watch-img"
									on:load={() => imageLoaded(watch.id)}
									on:error={() => imageLoaded(watch.id)}
								/>
							{:else}
								<img
									src=""
									alt="placeholder"
									class="rotated-watch-img"
									on:load={() => imageLoaded(watch.id)}
									on:error={() => imageLoaded(watch.id)}
								/>
							{/if}

							<div class="absolute inset-2 pointer-events-none mix-blend-overlay
                         border border-white/30"></div>
						</div>
					</div>

					<div
						class="md:col-span-4 order-3 flex flex-col justify-end items-center md:items-start h-full px-8 md:px-0 text-center md:text-left">
						<div class="max-w-xs space-y-8 md:space-y-8 md:pl-8">
							<p class="secondary-font text-sm md:text-xs leading-loose text-stone-700 md:text-stone-800 md:text-justify font-light">
								{watch.watchDescription}
							</p>

							<div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 pt-6 border-t w-full
                         'border-stone-800/10 md:border-stone-800/20">

                         <span class="footer-font-alt text-3xl md:text-3xl text-stone-900">
                            {priceFor(watch)}
                         </span>

								<button
									on:click={() => goto(`/watches/${watch.id}/`)}
									class="w-14 h-14 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 group/btn
	       border border-stone-800 hover:bg-stone-800 hover:text-[#E2D9DC]">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										class="group-hover/btn:-rotate-45 transition-transform duration-300">
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
								</button>

							</div>
						</div>
					</div>

				</div>
			</section>
		{/each}
	</main>
</div>

<style>
	/* Layout */
	.bg-gradient-custom {
		background: linear-gradient(90deg, #E2D9DC 0%, #DED5D8 50%, #B9B0B3 100%);
	}

	/* Gold Gradient Text */
	.text-gradient-gold {
		background: linear-gradient(135deg, #B08D55 0%, #D4AF37 50%, #8C6D36 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		color: #C5A059; /* Fallback */
	}

	/* Global Scroll Behavior */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Rotated Watch Logic */
	.rotated-watch-img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-90deg);
		transform-origin: center center;
		height: 100%;
		width: auto;
		max-width: none;
		max-height: none;
		object-fit: contain;
		pointer-events: none;
		will-change: transform;
	}
</style>
