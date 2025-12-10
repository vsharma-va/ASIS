<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import { setComponentReady, registerComponent, unregisterComponent } from '$lib/stores/loadingStore';

	// Register this component immediately when script runs
	// registerComponent('gallery');

	export let galleryData;

	let selectedVariantIndex = 0;
	let selectedImageIndex = 0;
	let isZoomed = false;
	let mainImageEl;
	let hasAnimatedIn = false; // Track if initial animation has run
	let isAnimating = false; // Prevent concurrent animations

	$: currentVariant = galleryData.variants[selectedVariantIndex];

	/* Robust mapping: normalize strings and try exact / partial matches so
	   gemstone labels map to variant names reliably (fixes Tsavorite bug). */
	function normalizeName(s) {
		return (s || '')
			.toString()
			.trim()
			.toLowerCase()
			.replace(/[^\w\s]/g, '') // remove punctuation
			.replace(/\s+/g, ' ');
	}

	function tokensOf(s) {
		return normalizeName(s).split(' ').filter(Boolean);
	}

	function findVariantIndexByGemstone(gemstone) {
		if (!galleryData || !galleryData.variants) return undefined;
		const gNorm = normalizeName(gemstone);
		if (!gNorm) return undefined;

		// 1) exact match
		for (let i = 0; i < galleryData.variants.length; i++) {
			const vNorm = normalizeName(galleryData.variants[i].name);
			if (vNorm === gNorm) return i;
		}

		// prepare token lists
		const gTokens = tokensOf(gemstone);

		// 2) whole-token match: any token equals any token in variant name
		for (let i = 0; i < galleryData.variants.length; i++) {
			const vTokens = tokensOf(galleryData.variants[i].name);
			// if any token in gTokens equals any token in vTokens -> match
			if (gTokens.some(gt => vTokens.includes(gt))) return i;
		}

		// 3) guarded substring fallback (only for longer names to avoid false positives)
		if (gNorm.length > 3) {
			for (let i = 0; i < galleryData.variants.length; i++) {
				const vNorm = normalizeName(galleryData.variants[i].name);
				if (vNorm.includes(gNorm) || gNorm.includes(vNorm)) return i;
			}
		}

		// no match
		return undefined;
	}

	// reactive map: gemstone label -> variant index (or undefined)
	$: gemstoneToIndex = (galleryData && galleryData.gemstones)
		? galleryData.gemstones.reduce((acc, g) => {
			acc[g] = findVariantIndexByGemstone(g);
			return acc;
		}, {})
		: {};

	// --- Animation Logic ---
	function animateCarouselIn() {
		if (isAnimating) return;
		isAnimating = true;

		gsap.fromTo(
			'.main-image-wrapper',
			{ scale: 0.95, opacity: 0 },
			{
				duration: 1.2,
				scale: 1,
				opacity: 1,
				ease: 'expo.out',
				onComplete: () => {
					isAnimating = false;
				}
			}
		);
		gsap.fromTo(
			'.thumbnail-item',
			{ y: 20, opacity: 0 },
			{ duration: 0.6, y: 0, opacity: 1, stagger: 0.07, ease: 'power2.out', delay: 0.4 }
		);
	}

	onMount(() => {
		// debug mapping (remove when finished)
		if (import.meta.env.DEV) {
			console.log('gemstoneToIndex for', galleryData?.id, gemstoneToIndex);
		}

		registerComponent('gallery');

		animateCarouselIn();
		gsap.fromTo(
			'.product-info > *',
			{ y: 30, opacity: 0 },
			{
				duration: 0.8,
				y: 0,
				opacity: 1,
				stagger: 0.08,
				ease: 'power3.out',
				delay: 0.2,
				onComplete: () => {
					hasAnimatedIn = true;
					setComponentReady('gallery', true);
				}
			}
		);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			gsap.killTweensOf('.main-image-wrapper');
			gsap.killTweensOf('.thumbnail-item');
			gsap.killTweensOf('.product-info > *');
			gsap.killTweensOf(mainImageEl);
		}

		// Unregister component when destroyed (client-only)
		unregisterComponent('gallery');
	});

	// --- State Handlers ---
	function selectVariant(index) {
		if (index === selectedVariantIndex || isAnimating || index == null || index < 0) return;
		isAnimating = true;

		const tl = gsap.timeline({
			onComplete: () => {
				selectedVariantIndex = index;
				selectedImageIndex = 0;
				isZoomed = false;
				isAnimating = false;
			}
		});

		tl.to('.main-image-wrapper', {
			duration: 0.3,
			opacity: 0,
			y: -20,
			ease: 'power2.in'
		});
	}

	function selectImage(index) {
		if (index === selectedImageIndex || isAnimating) return;
		isAnimating = true;

		const tl = gsap.timeline({
			onComplete: () => {
				isAnimating = false;
			}
		});

		tl.to(mainImageEl, {
			duration: 0.4,
			opacity: 0,
			scale: 0.98,
			ease: 'expo.in'
		});

		tl.call(() => {
			selectedImageIndex = index;
			if (isZoomed) {
				isZoomed = false;
				gsap.set(mainImageEl, { scale: 1, x: 0, y: 0 });
			}
		});

		tl.to(mainImageEl, {
			duration: 0.6,
			opacity: 1,
			scale: 1,
			ease: 'expo.out'
		});
	}

	function toggleZoom() {
		if (isAnimating) return;
		isZoomed = !isZoomed;
		if (isZoomed) {
			gsap.to(mainImageEl, { duration: 0.5, scale: 1.5, ease: 'power3.inOut' });
		} else {
			gsap.to(mainImageEl, { duration: 0.5, scale: 1, x: 0, y: 0, ease: 'power3.inOut' });
		}
	}

	function handleImageMouseMove(e) {
		if (!isZoomed || !mainImageEl) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		gsap.to(mainImageEl, { duration: 1, x: x * -150, y: y * -150, ease: 'power2.out' });
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="font-sans min-h-[115vh] bg-gradient text-zinc-800">
	<main class="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
		<div class="lg:col-span-1 h-[65vh] lg:h-screen flex flex-col p-4 sm:p-6 lg:p-8 lg:sticky lg:top-0 mt-[4rem]">
			{#key selectedVariantIndex}
				<div
					class="main-image-wrapper relative flex-1 w-full bg-white rounded-2xl overflow-hidden"
					on:mousemove={handleImageMouseMove}
					role="img"
					aria-label="Product image viewer"
				>
					{#key currentVariant.images[selectedImageIndex]}
						<div
							class="w-full h-full absolute flex items-center justify-center {isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}"
							on:click={toggleZoom}
							role="button"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && toggleZoom()}
						>
							<img
								bind:this={mainImageEl}
								src={currentVariant.images[selectedImageIndex]}
								alt={`${galleryData.title} - ${currentVariant.name}`}
								class="w-full h-full rounded-lg object-contain will-change-transform"
								loading="eager"
								decoding="async"
							/>
						</div>
					{/key}

					<div
						class="absolute top-5 left-5 bg-white/70 backdrop-blur-sm text-zinc-700 px-3 py-1 rounded-full text-sm font-medium">
						{selectedImageIndex + 1} / {currentVariant.images.length}
					</div>
				</div>

				<div class="flex-shrink-0 pt-6">
					<div class="flex justify-center items-center space-x-4">
						{#each currentVariant.images as image, index}
							<button
								class="thumbnail-item flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
								class:ring-2={selectedImageIndex === index}
								class:ring-zinc-800={selectedImageIndex === index}
								class:opacity-60={selectedImageIndex !== index}
								class:hover:opacity-100={selectedImageIndex !== index}
								class:hover:scale-105={selectedImageIndex !== index}
								on:click={() => selectImage(index)}
								aria-label={`View image ${index + 1}`}
								type="button"
							>
								<img src={image} alt="Thumbnail {index + 1}" class="w-10 h-10 object-cover"
									 loading="eager" />
							</button>
						{/each}
					</div>
				</div>
			{/key}
		</div>

		<div class="lg:col-span-1 flex items-center">
			<div class="p-8 sm:p-12 lg:p-16 w-full product-info space-y-8">
				<header class="space-y-3">
					<!--					<span-->
					<!--						class="text-sm font-medium text-zinc-500 tracking-wider uppercase">{galleryData.collection}</span>-->
					<h1 class="text-4xl lg:text-5xl font-light tracking-tight text-zinc-900">
						{galleryData.title}
					</h1>
					<p class="text-base text-zinc-600 max-w-prose">
						{galleryData.watchDescription}
					</p>
				</header>

				<section class="space-y-5">

					<div class="flex flex-wrap gap-1">
						{#each galleryData.variants as variant, index}
							<button
								on:click={() => selectVariant(index)}
								class="group relative flex items-center space-x-3 p-2 rounded-full transition-colors duration-200"
								class:bg-slate-100={selectedVariantIndex === index}
								class:hover:bg-slate-100={selectedVariantIndex !== index}
								title={variant.name}
								aria-label={`Select ${variant.name}`}
								type="button"
							>
								<div
									class="w-8 h-8 m-0 rounded-full shadow-inner border border-black/5 transition-transform duration-300 ease-out"
									class:scale-110={selectedVariantIndex === index}
									class:group-hover:scale-110={selectedVariantIndex !== index}
									style="background: linear-gradient(135deg, {variant.color}, {variant.accent})"
								></div>

								{#if selectedVariantIndex === index}
									<div
										class="absolute inset-0 rounded-full ring-2 ring-zinc-300 pointer-events-none"></div>
								{/if}
							</button>
						{/each}
					</div>
					<h3 class="text-base font-semibold text-zinc-900">Select Gemstone: <span
						class="font-medium text-zinc-600">{currentVariant.name}</span></h3>
				</section>

				<section class="space-y-4">
					<h3 class="text-base font-semibold text-zinc-900">Technical Specifications</h3>
					<div class="border border-zinc-200 rounded-xl p-2">
						{#each galleryData.specs as spec, index}
							<div class="flex justify-between items-center p-3" class:border-t={index > 0}
								 class:border-zinc-200={index > 0}>
								<span class="text-sm text-zinc-600">{spec.label}</span>
								<span class="text-sm font-semibold text-zinc-900">{spec.value}</span>
							</div>
						{/each}
					</div>
				</section>
				<section class="space-y-4">
					<h3 class="text-base font-semibold text-zinc-900">Available Gemstones</h3>
					<div class="flex flex-wrap gap-3">
						{#each galleryData.gemstones as gemstone}
							{#if gemstoneToIndex[gemstone] !== undefined}
								<button
									type="button"
									on:click={() => selectVariant(gemstoneToIndex[gemstone])}
									on:keydown={(e) =>
						e.key === 'Enter' && selectVariant(gemstoneToIndex[gemstone])
					}
									class="relative px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 focus:outline-none"
									class:bg-slate-100={selectedVariantIndex === gemstoneToIndex[gemstone]}
									class:border-zinc-300={selectedVariantIndex === gemstoneToIndex[gemstone]}
									class:border-zinc-200={selectedVariantIndex !== gemstoneToIndex[gemstone]}
									aria-pressed={selectedVariantIndex === gemstoneToIndex[gemstone]}
									aria-label={`Select gemstone ${gemstone}`}
								>
									{gemstone}

									{#if selectedVariantIndex === gemstoneToIndex[gemstone]}
										<!-- same ring overlay used by color circles -->
										<div
											class="absolute inset-0 rounded-full ring-2 ring-zinc-300 pointer-events-none"
										></div>
									{/if}
								</button>
							{:else}
								<!-- fallback (no matching variant) -->
								<span
									class="bg-slate-100 text-zinc-700 px-4 py-2 rounded-full text-sm font-medium border border-zinc-200"
								> {gemstone}
								</span>
							{/if}
						{/each}
					</div>
				</section>


				<!--				<section class="space-y-4">-->
				<!--					<h3 class="text-base font-semibold text-zinc-900">Available Gemstones</h3>-->
				<!--					<div class="flex flex-wrap gap-3">-->
				<!--						{#each galleryData.gemstones as gemstone}-->
				<!--							{#if gemstoneToIndex[gemstone] !== undefined}-->
				<!--								{ /* index resolved from robust mapping */ }-->
				<!--								{#let idx = gemstoneToIndex[gemstone]}-->
				<!--								<button-->
				<!--									type="button"-->
				<!--									on:click={() => idx !== undefined && selectVariant(idx)}-->
				<!--									on:keydown={(e) => e.key === 'Enter' && idx !== undefined && selectVariant(idx)}-->
				<!--									class="relative px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 focus:outline-none"-->
				<!--									class:bg-slate-100={selectedVariantIndex === idx}-->
				<!--									class:border-zinc-300={selectedVariantIndex === idx}-->
				<!--									class:border-zinc-200={selectedVariantIndex !== idx}-->
				<!--									aria-pressed={selectedVariantIndex === idx}-->
				<!--									aria-label={`Select gemstone ${gemstone}`}-->
				<!--								>-->
				<!--									{gemstone}-->
				<!--									{#if selectedVariantIndex === idx}-->
				<!--										&lt;!&ndash; same ring overlay used by color circles &ndash;&gt;-->
				<!--										<div-->
				<!--											class="absolute inset-0 rounded-full ring-2 ring-zinc-300 pointer-events-none"></div>-->
				<!--									{/if}-->
				<!--								</button>-->
				<!--								{/let}-->
				<!--							{:else}-->
				<!--								&lt;!&ndash; fallback (no matching variant) &ndash;&gt;-->
				<!--								<span-->
				<!--									class="bg-slate-100 text-zinc-700 px-4 py-2 rounded-full text-sm font-medium border border-zinc-200">-->
				<!--									{gemstone}-->
				<!--								</span>-->
				<!--							{/if}-->
				<!--						{/each}-->
				<!--					</div>-->
				<!--				</section>-->
			</div>
		</div>
	</main>
</div>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
	}
</style>
