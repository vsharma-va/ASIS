<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import { gsap } from 'gsap';
	import {
		setComponentReady,
		registerComponent,
		unregisterComponent
	} from '$lib/stores/loadingStore';

	export let galleryData;

	let selectedVariantIndex = 0;
	let selectedImageIndex = 0;
	let isZoomed = false;
	let mainImageEl;
	let isAnimating = false;

	// GSAP Performant Setters
	let xTo, yTo;

	$: currentVariant = galleryData.variants[selectedVariantIndex];

	// --- GEMSTONE MATCHING LOGIC (Unchanged) ---
	function normalizeName(s) {
		return (s || '').toString().trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\bpremium\b/g, '').replace(/\s+/g, ' ').trim();
	}

	function tokensOf(s) {
		return normalizeName(s).split(' ').filter(Boolean);
	}

	function findVariantIndexByGemstone(gemstone) {
		if (!galleryData || !galleryData.variants) return undefined;
		const gNorm = normalizeName(gemstone);
		if (!gNorm) return undefined;
		for (let i = 0; i < galleryData.variants.length; i++) {
			const vNorm = normalizeName(galleryData.variants[i].name);
			if (vNorm === gNorm) return i;
		}
		const gTokens = tokensOf(gemstone);
		if (gTokens.length > 0) {
			for (let i = 0; i < galleryData.variants.length; i++) {
				const vTokens = tokensOf(galleryData.variants[i].name);
				if (gTokens.every((gt) => vTokens.includes(gt))) return i;
			}
			for (let i = 0; i < galleryData.variants.length; i++) {
				const vTokens = tokensOf(galleryData.variants[i].name);
				if (gTokens.some((gt) => vTokens.includes(gt))) return i;
			}
		}
		if (gNorm.length > 3) {
			for (let i = 0; i < galleryData.variants.length; i++) {
				const vNorm = normalizeName(galleryData.variants[i].name);
				if (vNorm.includes(gNorm) || gNorm.includes(vNorm)) return i;
			}
		}
		if (gNorm.length >= 3) {
			const gPrefix = gNorm.substring(0, Math.min(4, gNorm.length));
			for (let i = 0; i < galleryData.variants.length; i++) {
				const vNorm = normalizeName(galleryData.variants[i].name);
				if (vNorm.startsWith(gPrefix)) return i;
			}
		}
		return undefined;
	}

	$: gemstoneToIndex = galleryData && galleryData.gemstones
		? galleryData.gemstones.reduce((acc, g) => {
			acc[g] = findVariantIndexByGemstone(g);
			return acc;
		}, {})
		: {};

	// --- OPTIMIZED ANIMATION ---

	onMount(() => {
		registerComponent('gallery');

		// Setup QuickTo for performant mouse movement
		if (mainImageEl) {
			xTo = gsap.quickTo(mainImageEl, 'x', { duration: 0.6, ease: 'power1.out' });
			yTo = gsap.quickTo(mainImageEl, 'y', { duration: 0.6, ease: 'power1.out' });
		}

		const tl = gsap.timeline({
			onComplete: () => setComponentReady('gallery', true)
		});

		tl.fromTo('.hero-title-char',
			{ y: 100, opacity: 0, rotateX: -20 },
			{ duration: 1.2, y: 0, opacity: 1, rotateX: 0, stagger: 0.05, ease: 'expo.out' }
		)
			.fromTo('.main-image-wrapper',
				{ opacity: 0, scale: 1.1 },
				{ duration: 1.5, opacity: 1, scale: 1, ease: 'power2.out' },
				'-=1'
			)
			.fromTo('.ui-fade-up',
				{ y: 20, opacity: 0 },
				{ duration: 0.8, y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out' },
				'-=1.2'
			)
			.fromTo('.content-block',
				{ x: 30, opacity: 0 },
				{ duration: 1, x: 0, opacity: 1, stagger: 0.1, ease: 'power3.out' },
				'-=0.8'
			);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			gsap.killTweensOf('*');
		}
		unregisterComponent('gallery');
	});

	// --- ACTIONS ---

	function selectVariant(index) {
		if (index === selectedVariantIndex || isAnimating || index == null || index < 0) return;
		isAnimating = true;

		const tl = gsap.timeline({
			onComplete: async () => {
				selectedVariantIndex = index;
				selectedImageIndex = 0;
				isZoomed = false;

				// Wait for DOM update
				await tick();

				// Reset transforms immediately before animating in
				if (mainImageEl) {
					gsap.set(mainImageEl, { clearProps: 'all' });
					// Re-init quickTo on new element if necessary (Svelte usually recycles, but safe to check)
					xTo = gsap.quickTo(mainImageEl, 'x', { duration: 0.6, ease: 'power1.out' });
					yTo = gsap.quickTo(mainImageEl, 'y', { duration: 0.6, ease: 'power1.out' });
				}

				// Animate back in
				gsap.fromTo(mainImageEl,
					{ opacity: 0, scale: 0.95 },
					{ duration: 0.6, opacity: 1, scale: 1, ease: 'power2.out', onComplete: () => isAnimating = false }
				);
			}
		});

		tl.to(mainImageEl, {
			duration: 0.25,
			opacity: 0,
			scale: 0.95,
			ease: 'power2.in'
		});
	}

	function selectImage(index) {
		if (index === selectedImageIndex || isAnimating) return;
		isAnimating = true;

		const tl = gsap.timeline();

		tl.to(mainImageEl, {
			duration: 0.25,
			opacity: 0,
			x: -20,
			ease: 'power1.in',
			onComplete: async () => {
				selectedImageIndex = index;
				if (isZoomed) isZoomed = false;
				await tick();

				// Pre-set position for slide-in
				gsap.set(mainImageEl, { x: 20, scale: 1, opacity: 0 });

				gsap.to(mainImageEl, {
					duration: 0.5,
					opacity: 1,
					x: 0,
					ease: 'power2.out',
					onComplete: () => isAnimating = false
				});
			}
		});
	}

	function toggleZoom() {
		if (isAnimating) return;
		isZoomed = !isZoomed;

		if (isZoomed) {
			gsap.to(mainImageEl, { duration: 1, scale: 2, ease: 'expo.inOut' });
		} else {
			// Reset using QuickTo targets to ensure sync
			xTo(0);
			yTo(0);
			gsap.to(mainImageEl, { duration: 0.8, scale: 1, x: 0, y: 0, ease: 'expo.inOut' });
		}
	}

	function handleImageMouseMove(e) {
		if (!isZoomed || !mainImageEl || !xTo || !yTo) return;
		const rect = e.currentTarget.getBoundingClientRect();

		// Calculate normalized position (-0.5 to 0.5)
		const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
		const yNorm = (e.clientY - rect.top) / rect.height - 0.5;

		// Use QuickTo for high performance updates without garbage collection overhead
		xTo(xNorm * -400);
		yTo(yNorm * -400);
	}

	// --- PRELOADER ACTION ---
	// Silently loads images in background so they are ready when clicked
	function preloadImages(node, urls) {
		if (!urls || !urls.length) return;
		urls.forEach(url => {
			const img = new Image();
			img.src = url;
			img.decoding = 'async'; // Important
		});
	}
</script>

<div class="bg-gradient w-full min-h-screen text-zinc-900 selection:bg-zinc-800 selection:text-white">
	<main class="grid grid-cols-1 lg:grid-cols-12 min-h-screen">

		<div
			class="lg:col-span-7 relative h-[55vh] lg:h-screen lg:sticky lg:top-0 lg:self-start overflow-hidden flex flex-col">

			<div class="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
				 style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMwMDAiLz48L3N2Zz4=');">
			</div>

			<div class="absolute top-6 left-6 lg:top-8 lg:left-8 z-20 pointer-events-none ui-fade-up">
				<span
					class="secondary-font text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">Exhibit A</span>
			</div>

			<div class="flex-1 relative w-full h-full flex items-center justify-center p-6 lg:p-0">
				<div
					class="main-image-wrapper relative w-full h-full max-w-4xl max-h-[45vh] lg:max-h-[80vh] flex items-center justify-center z-10"
					style="contain: layout paint;"
					on:mousemove={handleImageMouseMove}
					on:click={toggleZoom}
					role="button"
					tabindex="0"
					on:keydown={(e) => e.key === 'Enter' && toggleZoom()}
				>
					{#key currentVariant.images[selectedImageIndex]}
						<img
							bind:this={mainImageEl}
							src={currentVariant.images[selectedImageIndex]}
							alt={`${galleryData.title} - ${currentVariant.name}`}
							class="w-full h-full object-contain will-change-transform relative z-10 {isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}"
							decoding="async"
						/>
					{/key}
				</div>
			</div>

			<div class="absolute bottom-6 lg:bottom-8 w-full flex justify-center z-20 px-4 ui-fade-up">
				<div
					class="flex items-center gap-4 lg:gap-6 px-4 lg:px-6 py-2 lg:py-3 bg-white/30 backdrop-blur-xl border border-white/40 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.05)]">

					<div class="flex gap-2">
						{#each currentVariant.images as image, index}
							<button
								class="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden transition-all duration-300 group focus:outline-none"
								on:click|stopPropagation={() => selectImage(index)}
							>
								<div
									class="absolute inset-0 bg-zinc-900/10 group-hover:bg-transparent transition-colors z-10"></div>
								<img
									src={image}
									alt="thumb"
									class="w-full h-full object-cover transition-transform duration-500"
									class:scale-110={selectedImageIndex === index}
									decoding="async"
									loading="lazy"
								/>
								{#if selectedImageIndex === index}
									<div
										class="absolute inset-0 ring-[1.5px] ring-inset ring-zinc-800 rounded-full z-20"></div>
								{/if}
							</button>
						{/each}
					</div>

					<div class="h-4 w-px bg-zinc-400/30"></div>

					<span
						class="secondary-font text-[9px] lg:text-[10px] font-bold tracking-widest text-zinc-700 min-w-[3ch] text-center">
                    {selectedImageIndex + 1}/{currentVariant.images.length}
                </span>

				</div>
			</div>
		</div>

		<div class="lg:col-span-5 relative z-20 bg-white/10 backdrop-blur-[2px] lg:border-l border-white/20 min-h-full">
			<div use:preloadImages={galleryData.variants.flatMap(v => v.images)} class="hidden"></div>

			<div
				class="flex flex-col justify-center min-h-[50vh] lg:min-h-screen px-6 py-10 sm:px-12 lg:px-16 xl:px-20 space-y-12 lg:space-y-16">

				<header class="relative space-y-6 lg:space-y-8">
					<div class="flex items-center gap-3 ui-fade-up overflow-hidden">
						<div class="h-[2px] w-6 bg-zinc-800"></div>
						<h2 class="secondary-font text-[10px] sm:text-xs font-bold tracking-[0.3em] text-zinc-800 uppercase">
							Collection
						</h2>
					</div>

					<div class="relative">
						<h1 class="primary-font text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-light tracking-tighter text-zinc-900 leading-[0.85] overflow-visible">
							<span class="block hero-title-char">{galleryData.title}</span>
						</h1>
					</div>

					<div class="content-block relative pl-6 border-l border-zinc-400/40">
						<p class="secondary-font text-base sm:text-sm lg:text-lg text-zinc-700 leading-relaxed font-light">
							{galleryData.watchDescription}
						</p>
					</div>
				</header>

				<section class="space-y-8 lg:space-y-10">
					<div class="content-block space-y-5">
						<div class="flex justify-between items-baseline border-b border-zinc-400/20 pb-2">
							<h3 class="secondary-font text-[14px] sm:text-sm font-bold text-zinc-900 tracking-widest uppercase">
								VARIANT</h3>
							<span class="secondary-font text-sm text-zinc-700 italic">{currentVariant.name}</span>
						</div>

						<div class="flex flex-wrap gap-4 sm:gap-5 pt-2">
							{#each galleryData.gemstones as gemstone}
								{@const index = gemstoneToIndex[gemstone]}

								{#if index !== undefined}
									{@const variant = galleryData.variants[index]}
									<button
										on:click={() => selectVariant(index)}
										class="group relative flex flex-col items-center gap-2 focus:outline-none"
										aria-label="Select {variant.name}"
									>
										<div
											class="w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 group-hover:-translate-y-1"
											class:scale-110={selectedVariantIndex === index}
											style="
                                    background: {variant.color ? `linear-gradient(135deg, ${variant.color}, ${variant.accent || variant.color})` : '#e4e4e7'};
                                    box-shadow: {selectedVariantIndex === index
                                        ? `0 10px 25px -5px ${variant.color}88, 0 0 0 1px rgba(0,0,0,0.8)`
                                        : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'};
                                  "
										></div>
										<div class="h-1 w-1 rounded-full bg-zinc-900 transition-all duration-300"
											 class:opacity-100={selectedVariantIndex === index}
											 class:opacity-0={selectedVariantIndex !== index}>
										</div>
									</button>
								{/if}
							{/each}
						</div>
					</div>

					<div class="content-block space-y-5">
						<h3 class="secondary-font text-[14px] sm:text-sm font-bold text-zinc-900 tracking-widest uppercase">
							Gemstones</h3>

						<div class="flex flex-col items-start gap-3">
							{#each galleryData.gemstones as gemstone}
								{#if gemstoneToIndex[gemstone] !== undefined}
									<button
										on:click={() => selectVariant(gemstoneToIndex[gemstone])}
										class="relative px-3 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-[13px] uppercase tracking-[0.15em] font-bold border transition-all duration-300 secondary-font overflow-hidden group w-full text-left sm:w-auto"
										class:border-zinc-800={selectedVariantIndex === gemstoneToIndex[gemstone]}
										class:text-white={selectedVariantIndex === gemstoneToIndex[gemstone]}
										class:text-zinc-600={selectedVariantIndex !== gemstoneToIndex[gemstone]}
										class:border-zinc-300={selectedVariantIndex !== gemstoneToIndex[gemstone]}
										class:hover:border-zinc-500={selectedVariantIndex !== gemstoneToIndex[gemstone]}
									>
										<div
											class="absolute inset-0 bg-zinc-800 transition-transform duration-300 origin-left"
											class:scale-x-100={selectedVariantIndex === gemstoneToIndex[gemstone]}
											class:scale-x-0={selectedVariantIndex !== gemstoneToIndex[gemstone]}>
										</div>

										<span class="relative z-10">{gemstone}</span>
									</button>
								{:else}
                            <span
								class="px-3 py-2 sm:px-4 sm:py-2.5 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold border border-transparent text-zinc-400/50 bg-black/5 cursor-not-allowed secondary-font w-full sm:w-auto text-left">
                               {gemstone}
                            </span>
								{/if}
							{/each}
						</div>
					</div>
				</section>

				<section class="content-block pt-8 lg:pt-12 mt-auto">
					<div
						class="grid grid-cols-2 gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-10 border-t border-zinc-800/10 pt-8 lg:pt-10">
						{#each galleryData.specs as spec}
							<div class="group">
								<dt class="secondary-font text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1 lg:mb-2 group-hover:text-zinc-800 transition-colors">
									{spec.label}
								</dt>
								<dd class="secondary-font text-base sm:text-lg text-zinc-900 leading-tight">
									{spec.value}
								</dd>
							</div>
						{/each}
					</div>
				</section>

			</div>
		</div>
	</main>
</div>

<style>
	.bg-gradient {
		background: linear-gradient(
			90deg,
			#E2D9DC 0%,
			#DED5D8 50%,
			#B9B0B3 100%
		);
	}
</style>