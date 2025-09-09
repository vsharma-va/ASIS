<script>
	import { onMount, afterUpdate } from 'svelte';
	import { gsap } from 'gsap';

	export let galleryData

	let selectedVariantIndex = 0;
	let selectedImageIndex = 0;
	let isZoomed = false;
	let mainImageEl;

	$: currentVariant = galleryData.variants[selectedVariantIndex];

	// --- Animation Logic ---
	function animateCarouselIn() {
		gsap.fromTo('.main-image-wrapper',
			{ scale: 0.95, opacity: 0 },
			{ duration: 1.2, scale: 1, opacity: 1, ease: 'expo.out' }
		);
		gsap.fromTo('.thumbnail-item',
			{ y: 20, opacity: 0 },
			{ duration: 0.6, y: 0, opacity: 1, stagger: 0.07, ease: 'power2.out', delay: 0.4 }
		);
	}

	onMount(() => {
		// Animate everything on initial page load
		animateCarouselIn();
		gsap.fromTo('.product-info > *',
			{ y: 30, opacity: 0 },
			{ duration: 0.8, y: 0, opacity: 1, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
		);
	});

	afterUpdate(() => {
		if (mainImageEl && mainImageEl.getAttribute('src') !== currentVariant.images[selectedImageIndex]) {
			if (!mainImageEl.complete) {
				mainImageEl.onload = () => animateCarouselIn();
			} else {
				animateCarouselIn();
			}
		}
	});

	// --- State Handlers ---
	function selectVariant(index) {
		if (index === selectedVariantIndex) return;

		const tl = gsap.timeline({
			onComplete: () => {
				selectedVariantIndex = index;
				selectedImageIndex = 0;
				isZoomed = false;
			}
		});

		tl.to('.main-image-wrapper', {
			duration: 0.3,
			opacity: 0,
			y: -20,
			ease: 'power2.in'
		});
	}

	/**
	 * ## IMPROVED ANIMATION ##
	 * This function now uses a smoother fade and scale transition
	 * for a more elegant and less abrupt image change.
	 */
	function selectImage(index) {
		if (index === selectedImageIndex) return;

		const tl = gsap.timeline();

		// Animate out the current image (fade and subtle scale down)
		tl.to(mainImageEl, {
			duration: 0.4,
			opacity: 0,
			scale: 0.98,
			ease: 'expo.in'
		});

		// Update the state after the out-animation
		tl.call(() => {
			selectedImageIndex = index;
			if (isZoomed) {
				isZoomed = false;
				gsap.set(mainImageEl, { scale: 1, x: 0, y: 0 });
			}
		});

		// Let Svelte update the DOM
		// tl.add(() => {}, '+=0.01');

		// Animate in the new image (fade in and scale up to normal)
		tl.fromTo(mainImageEl,
			{
				duration: 0.6,
				opacity: 1,
				scale: 1,
				ease: 'expo.out'
			}
		);
	}

	function toggleZoom() {
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


<div class="font-sans min-h-screen bg-gradient text-zinc-800">
	<main class="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

		<div class="lg:col-span-1 h-[65vh] lg:h-screen flex flex-col p-4 sm:p-6 lg:p-8 lg:sticky lg:top-0">
			{#key selectedVariantIndex}
				<div
					class="main-image-wrapper relative flex-1 w-full bg-slate-100 rounded-2xl overflow-hidden"
					on:mousemove={handleImageMouseMove}
				>
					{#key currentVariant.images[selectedImageIndex]}
						<div
							class="absolute flex items-center justify-center {isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}"
							on:click={toggleZoom}
						>
							<img
								bind:this={mainImageEl}
								src={currentVariant.images[selectedImageIndex]}
								alt={`${galleryData.title} - ${currentVariant.name}`}
								class="w-full h-full rounded-lg object-fit will-change-transform"
							/>
						</div>
					{/key}

					<div class="absolute top-5 left-5 bg-white/70 backdrop-blur-sm text-zinc-700 px-3 py-1 rounded-full text-sm font-medium">
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
							>
								<img src={image} alt="Thumbnail {index + 1}" class="w-20 h-20 object-cover"/>
							</button>
						{/each}
					</div>
				</div>
			{/key}
		</div>

		<div class="lg:col-span-1 flex items-center">
			<div class="p-8 sm:p-12 lg:p-16 w-full product-info space-y-10">
				<header class="space-y-3">
					<span class="text-sm font-medium text-zinc-500 tracking-wider uppercase">{galleryData.collection}</span>
					<h1 class="text-4xl lg:text-5xl font-light tracking-tight text-zinc-900">
						{galleryData.title}
					</h1>
					<p class="text-base text-zinc-600 max-w-prose">
						{galleryData.watchDescription}
					</p>
				</header>

				<section class="space-y-5">
					<h3 class="text-base font-semibold text-zinc-900">Select Gemstone: <span class="font-medium text-zinc-600">{currentVariant.name}</span></h3>
					<div class="flex flex-wrap gap-4">
						{#each galleryData.variants as variant, index}
							<button
								on:click={() => selectVariant(index)}
								class="group relative flex items-center space-x-3 p-2 pr-4 rounded-full transition-colors duration-200"
								class:bg-slate-100={selectedVariantIndex === index}
								class:hover:bg-slate-100={selectedVariantIndex !== index}
								title={variant.name}
							>
								<div
									class="w-8 h-8 rounded-full shadow-inner border border-black/5 transition-transform duration-300 ease-out"
									class:scale-110={selectedVariantIndex === index}
									class:group-hover:scale-110={selectedVariantIndex !== index}
									style="background: linear-gradient(135deg, {variant.color}, {variant.accent})"
								></div>
								<span class="text-sm font-medium">{variant.name}</span>
								{#if selectedVariantIndex === index}
									<div class="absolute inset-0 rounded-full ring-2 ring-zinc-300"></div>
								{/if}
							</button>
						{/each}
					</div>
				</section>

				<section class="space-y-4">
					<h3 class="text-base font-semibold text-zinc-900">Technical Specifications</h3>
					<div class="border border-zinc-200 rounded-xl p-2">
						{#each galleryData.specs as spec, index}
							<div class="flex justify-between items-center p-3" class:border-t={index > 0} class:border-zinc-200={index > 0}>
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
                            <span class="bg-slate-100 text-zinc-700 px-4 py-2 rounded-full text-sm font-medium border border-zinc-200">
                                {gemstone}
                            </span>
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