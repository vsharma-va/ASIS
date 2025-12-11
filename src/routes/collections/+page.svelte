<script>
	import { onMount, onDestroy } from 'svelte';
	import {
		registerComponent,
		unregisterComponent,
		setComponentReady
	} from '$lib/stores/loadingStore';
	import { getAllWatches } from '$lib/stores/watchData';

	// Load watches from the comprehensive store
	// Filter only enabled watches and keep original ordering
	let watches = getAllWatches().filter((w) => w.isEnabled);
	console.log('Loaded watches:', watches);

	// Track timers so we can clear fallback timers when image loads/errors
	const fallbackTimers = new Map();
	// timeout per image before forcing ready (ms)
	const IMAGE_FALLBACK_MS = 7000;

	const compName = (id) => `watch-image-${id}`;

	// Called when landing image for a watch is loaded (or errored)
	function imageLoaded(id) {
		const name = compName(id);

		// clear fallback timer if present
		const t = fallbackTimers.get(id);
		if (t) {
			clearTimeout(t);
			fallbackTimers.delete(id);
		}

		setComponentReady(name, true);
	}

	onMount(() => {
		// Register each image as an expected component
		for (const w of watches) {
			// register the landing image for each watch
			const name = compName(w.id);
			registerComponent(name);

			// set fallback timer so loader doesn't hang indefinitely
			const t = setTimeout(() => {
				setComponentReady(name, true);
				fallbackTimers.delete(w.id);
			}, IMAGE_FALLBACK_MS);
			fallbackTimers.set(w.id, t);
		}
	});

	onDestroy(() => {
		// cleanup: clear timers and unregister components
		for (const w of watches) {
			const t = fallbackTimers.get(w.id);
			if (t) clearTimeout(t);
			fallbackTimers.delete(w.id);

			unregisterComponent(compName(w.id));
		}
	});

	// Small helpers used in the template
	function landingImageFor(w) {
		// watchData provides landingImage (often a URL) — fallback to first variant image if missing
		if (w.landingImage) return w.landingImage;
		if (w.variants && w.variants.length && w.variants[0].images && w.variants[0].images.length)
			return w.variants[0].images[0];
		return null;
	}

	function priceFor(w) {
		// Use the 'Variants' spec value if present, else compute from variants length
		const vSpec = Array.isArray(w.specs) ? w.specs.find((s) => String(s.label).toLowerCase().includes('variant')) : null;
		if (vSpec && vSpec.value) return vSpec.value;
		if (w.variants) return `${w.variants.length} Variations`;
		return '';
	}

	function specsList(w) {
		// convert specs (array of {label,value}) to display strings
		if (!w.specs) return [];
		return w.specs.map((s) => (typeof s === 'string' ? s : `${s.label}: ${s.value}`));
	}
</script>

<!-- Main Wrapper -->
<div
	class="relative min-h-screen bg-gradient-custom text-black overflow-x-hidden selection:bg-stone-800 selection:text-[#E2D9DC]">

	<!-- Main Content Flow -->
	<main class="flex flex-col w-full">

		<!-- INTRO SECTION -->
		<section class="min-h-screen w-full flex flex-col justify-center items-center relative px-6 md:px-24 py-32">
			<div class="text-center relative z-10">
				<h2 class="footer-font text-[18vw] md:text-[15vw] leading-[0.85] text-stone-800 select-none">
					AS-IS<br />COLLECTIONS
				</h2>
				<div class="mt-12 max-w-md mx-auto">
					<p class="secondary-font text-lg md:text-xl italic text-stone-600 leading-relaxed">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
					</p>
				</div>
			</div>

			<!-- Decorative Spinning Circles (Fixed behind) -->
			<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  opacity-100 z pointer-events-none">
				<div
					class="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] border border-stone-800 rounded-full animate-[spin_60s_linear_infinite]"></div>
			</div>
		</section>

		<!-- WATCH SECTIONS -->
		{#each watches as watch, i}
			<section
				class="min-h-screen w-full flex items-center justify-center relative px-4 md:px-0 py-24 border-t border-stone-800/5 group">

				<!-- Background Large Typography -->
				<div
					class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
					<span class="footer-font text-[30vw] text-stone-400/10 whitespace-nowrap blur-[1px]">
						{watch.collection.split(" ")[1]}
					</span>
				</div>

				<!-- Main Grid Layout -->
				<div
					class="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center relative z-10">

					<!-- Text Left -->
					<div
						class="md:col-span-4 md:text-right order-2 md:order-1 flex flex-col justify-center items-start md:items-end space-y-6">
						<div
							class="bg-stone-800 text-[#E2D9DC] px-4 py-1 rounded-full secondary-font text-xs inline-block mb-2 shadow-lg">
							Collection No. 0{i + 1}
						</div>
						<h3 class="primary-font text-5xl md:text-6xl lg:text-7xl text-stone-900 leading-[0.9]">
							{watch.collection}
						</h3>
						<p class="primary-font text-xl italic text-stone-600 max-w-xs md:ml-auto">
							"{watch.subCollection || watch.title}"
						</p>
						<!-- Specs List -->
						<ul class="secondary-font text-[10px] text-stone-500 uppercase tracking-wider space-y-2 border-l md:border-l-0 md:border-r border-stone-400 pl-4 md:pl-0 md:pr-4 pt-4">
							{#each specsList(watch) as spec}
								<li>{spec}</li>
							{/each}
						</ul>
					</div>

					<!-- Image Center -->
					<div
						class="md:col-span-4 order-1 md:order-2 flex justify-center items-center relative py-8 md:py-0">
						<!-- Image Container -->
						<div
							class="relative overflow-hidden w-[80vw] h-[80vw] md:w-[28vw] md:h-[35vw] bg-stone-300 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-transform duration-500 hover:scale-[1.02]">
							{#if landingImageFor(watch)}
								<img
									src={landingImageFor(watch)}
									alt={watch.collection}
									class="rotated-watch-img"
									on:load={() => imageLoaded(watch.id)}
									on:error={() => imageLoaded(watch.id)}
								/>
							{:else}
								<!-- If no image available at all, still mark as loaded to avoid blocking loader -->
								<img
									src=""
									alt="placeholder"
									class="rotated-watch-img"
									on:load={() => imageLoaded(watch.id)}
									on:error={() => imageLoaded(watch.id)}
								/>
							{/if}

							<!-- Frame Border -->
							<div class="absolute inset-2 border border-white/20 pointer-events-none"></div>
						</div>
					</div>

					<!-- Details Right -->
					<div class="md:col-span-4 order-3 flex flex-col justify-end items-start h-full pb-8 md:pb-0">
						<div class="max-w-xs space-y-8 md:pl-8">
							<p class="secondary-font text-xs leading-relaxed text-stone-800 text-justify">
								{watch.watchDescription}
							</p>

							<div class="flex items-center gap-6 pt-6 border-t border-stone-800/20 w-full">
								<span
									class="footer-font-alt text-2xl md:text-3xl text-stone-800">{priceFor(watch)}</span>
								<button
									class="w-12 h-12 rounded-full border border-stone-800 flex items-center justify-center hover:bg-stone-800 hover:text-[#E2D9DC] transition-colors group/btn">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
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

	/* Global Scroll Behavior */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Replace previous .rotated-watch-img rules with these */
	.rotated-watch-img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-90deg); /* 90° anticlockwise */
		transform-origin: center center;
		height: 100%; /* <--- ensure image height equals container height */
		width: auto; /* width scales automatically to preserve aspect */
		max-width: none;
		max-height: none;
		object-fit: cover; /* keep same cropping behavior */
		pointer-events: none;
		will-change: transform;
	}


</style>