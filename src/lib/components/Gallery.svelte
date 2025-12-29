<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import { setComponentReady, registerComponent, unregisterComponent } from '$lib/stores/loadingStore';

	export let galleryData;

	let selectedVariantIndex = 0;
	let selectedImageIndex = 0;
	let isZoomed = false;
	let mainImageEl;
	let hasAnimatedIn = false;
	let isAnimating = false;

	$: currentVariant = galleryData.variants[selectedVariantIndex];

	function normalizeName(s) {
		return (s || '')
			.toString()
			.trim()
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.replace(/\s+/g, ' ');
	}

	function tokensOf(s) {
		return normalizeName(s).split(' ').filter(Boolean);
	}

	function findVariantIndexByGemstone(gemstone) {
		if (!galleryData || !galleryData.variants) return undefined;
		const gNorm = normalizeName(gemstone);
		if (!gNorm) return undefined;

		// 1. Exact match
		for (let i = 0; i < galleryData.variants.length; i++) {
			const vNorm = normalizeName(galleryData.variants[i].name);
			if (vNorm === gNorm) return i;
		}

		// 2. Token-based matching
		const gTokens = tokensOf(gemstone);
		if (gTokens.length > 0) {
			for (let i = 0; i < galleryData.variants.length; i++) {
				const vTokens = tokensOf(galleryData.variants[i].name);
				if (gTokens.every(gt => vTokens.includes(gt))) return i;
			}
			for (let i = 0; i < galleryData.variants.length; i++) {
				const vTokens = tokensOf(galleryData.variants[i].name);
				if (gTokens.some(gt => vTokens.includes(gt))) return i;
			}
		}

		// 3. Substring matching
		if (gNorm.length > 3) {
			for (let i = 0; i < galleryData.variants.length; i++) {
				const vNorm = normalizeName(galleryData.variants[i].name);
				if (vNorm.includes(gNorm) || gNorm.includes(vNorm)) return i;
			}
		}

		// 4. Fuzzy matching
		if (gNorm.length >= 3) {
			const gPrefix = gNorm.substring(0, Math.min(4, gNorm.length));
			for (let i = 0; i < galleryData.variants.length; i++) {
				const vNorm = normalizeName(galleryData.variants[i].name);
				if (vNorm.startsWith(gPrefix)) return i;
			}
		}

		return undefined;
	}

	$: gemstoneToIndex = (galleryData && galleryData.gemstones)
		? galleryData.gemstones.reduce((acc, g) => {
			acc[g] = findVariantIndexByGemstone(g);
			return acc;
		}, {})
		: {};

	// --- ANIMATION & LIFECYCLE ---
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
		unregisterComponent('gallery');
	});

	// --- ACTIONS ---
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

<div class="font-sans min-h-[115vh] bg-gradient text-zinc-800 relative z-20">
	<main class="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
		<div class="lg:col-span-1 h-[65vh] lg:h-screen flex flex-col p-6 sm:p-8 lg:p-12 lg:sticky lg:top-0 mt-[4rem] relative z-20">
			{#key selectedVariantIndex}
				<div
					class="main-image-wrapper relative flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-lg"
					on:mousemove={handleImageMouseMove}
					role="img"
					aria-label="Product image viewer"
					style="box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);"
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
						class="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-zinc-800 px-4 py-2 rounded-full text-xs font-semibold tracking-wide shadow-sm">
						{selectedImageIndex + 1} / {currentVariant.images.length}
					</div>
				</div>

				<div class="flex-shrink-0 pt-8">
					<div class="flex justify-center items-center gap-3">
						{#each currentVariant.images as image, index}
							<button
								class="thumbnail-item flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 ease-out shadow-sm hover:shadow-md cursor-pointer"
								class:ring-2={selectedImageIndex === index}
								class:ring-zinc-900={selectedImageIndex === index}
								class:ring-offset-2={selectedImageIndex === index}
								class:opacity-50={selectedImageIndex !== index}
								class:hover:opacity-100={selectedImageIndex !== index}
								class:scale-105={selectedImageIndex === index}
								class:hover:scale-105={selectedImageIndex !== index}
								on:click={() => selectImage(index)}
								aria-label={`View image ${index + 1}`}
								type="button"
							>
								<img src={image} alt="Thumbnail {index + 1}" class="w-14 h-14 object-cover"
									 loading="eager" />
							</button>
						{/each}
					</div>
				</div>
			{/key}
		</div>

		<div class="lg:col-span-1 flex items-center relative z-20">
			<div class="p-8 sm:p-12 lg:p-20 w-full product-info space-y-10">
				<header class="space-y-4">
					<h1 class="text-5xl lg:text-6xl font-light tracking-tight text-zinc-900 leading-tight">
						{galleryData.title}
					</h1>
					<p class="text-lg text-zinc-600 max-w-prose leading-relaxed">
						{galleryData.watchDescription}
					</p>
				</header>

				<section class="space-y-6">
					<div>
						<h3 class="text-sm font-semibold text-zinc-900 tracking-wide uppercase mb-4 opacity-60">Variant</h3>
						<div class="flex flex-wrap gap-2">
							{#each galleryData.gemstones as gemstone}
								{@const index = gemstoneToIndex[gemstone]}

								{#if index !== undefined}
									{@const variant = galleryData.variants[index]}

									<button
										on:click={() => selectVariant(index)}
										class="group relative flex items-center p-2 rounded-2xl transition-all duration-300 cursor-pointer"
										class:bg-zinc-100={selectedVariantIndex === index}
										class:shadow-sm={selectedVariantIndex === index}
										class:hover:bg-zinc-50={selectedVariantIndex !== index}
										title={variant.name}
										aria-label={`Select ${variant.name}`}
										type="button"
									>
										<div
											class="w-10 h-10 rounded-full shadow-md transition-all duration-300 ease-out"
											class:scale-110={selectedVariantIndex === index}
											class:shadow-lg={selectedVariantIndex === index}
											class:group-hover:scale-105={selectedVariantIndex !== index}
											style="background: {variant.color ? `linear-gradient(135deg, ${variant.color}, ${variant.accent || variant.color})` : '#e4e4e7'}; border: 2px solid rgba(255,255,255,0.8)"
										></div>

										{#if selectedVariantIndex === index}
											<div
												class="absolute inset-0 rounded-2xl ring-2 ring-zinc-400 pointer-events-none"></div>
										{/if}
									</button>
								{/if}
							{/each}
						</div>
					</div>

					<p class="text-base text-zinc-700">
						<span class="font-medium">Selected:</span>
						<span class="text-zinc-900 font-semibold">{currentVariant.name}</span>
					</p>
				</section>

				<section class="space-y-5">
					<h3 class="text-sm font-semibold text-zinc-900 tracking-wide uppercase opacity-60">Specifications</h3>
					<div class="border border-zinc-200/60 rounded-2xl overflow-hidden bg-white/40">
						{#each galleryData.specs as spec, index}
							<div class="flex justify-between items-center px-5 py-4" class:border-t={index > 0}
								 class:border-zinc-200={index > 0}>
								<span class="text-sm text-zinc-600 font-medium">{spec.label}</span>
								<span class="text-sm font-semibold text-zinc-900">{spec.value}</span>
							</div>
						{/each}
					</div>
				</section>

				<section class="space-y-5">
					<h3 class="text-sm font-semibold text-zinc-900 tracking-wide uppercase opacity-60">Gemstones</h3>
					<div class="flex flex-wrap gap-2">
						{#each galleryData.gemstones as gemstone}
							{#if gemstoneToIndex[gemstone] !== undefined}
								<button
									type="button"
									on:click={() => selectVariant(gemstoneToIndex[gemstone])}
									on:keydown={(e) =>
                               e.key === 'Enter' && selectVariant(gemstoneToIndex[gemstone])
                            }
									class="relative px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-200 focus:outline-none hover:shadow-sm cursor-pointer"
									class:bg-zinc-900={selectedVariantIndex === gemstoneToIndex[gemstone]}
									class:text-white={selectedVariantIndex === gemstoneToIndex[gemstone]}
									class:border-zinc-900={selectedVariantIndex === gemstoneToIndex[gemstone]}
									class:bg-white={selectedVariantIndex !== gemstoneToIndex[gemstone]}
									class:text-zinc-700={selectedVariantIndex !== gemstoneToIndex[gemstone]}
									class:border-zinc-200={selectedVariantIndex !== gemstoneToIndex[gemstone]}
									class:hover:border-zinc-300={selectedVariantIndex !== gemstoneToIndex[gemstone]}
									aria-pressed={selectedVariantIndex === gemstoneToIndex[gemstone]}
									aria-label={`Select gemstone ${gemstone}`}
								>
									{gemstone}
								</button>
							{:else}
                         <span
							 class="bg-zinc-100 text-zinc-500 px-5 py-2.5 rounded-full text-sm font-medium border-2 border-zinc-200"
						 >
                            {gemstone}
                         </span>
							{/if}
						{/each}
					</div>
				</section>
			</div>
		</div>
	</main>
</div>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
	}
</style>