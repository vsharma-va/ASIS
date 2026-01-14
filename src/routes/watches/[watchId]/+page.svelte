<script>
	import { goto } from '$app/navigation';
	import { onMount, onDestroy, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Gallery from '$lib/components/Gallery.svelte';
	import { setComponentReady, registerComponent, unregisterComponent, smoother } from '$lib/stores/loadingStore';
	import logoImg from '$lib/assets/images/AS IS.png';
	import { getAllWatchIds, getWatchById } from '$lib/stores/watchData';

	export let data;

	let watchData = null;
	let galleryData = null;
	let prevCollectionName = '';
	let nextCollectionName = '';

	// Menu State
	let isMenuOpen = false;
	let allWatches = [];
	let ctx = null; // GSAP Context storage
	let currentWatchId = null; // To track ID changes

	$: watchData = data?.watch ?? null;

	// --- 1. DATA REACTIVITY ---
	$: if (watchData) {
		galleryData = {
			collection: watchData.subCollection,
			subCollection: watchData.collection,
			title: watchData.title,
			watchDescription: watchData.watchDescription,
			specs: watchData.specs,
			gemstones: watchData.gemstones,
			variants: watchData.variants,
			id: watchData.id
		};
		updateCollectionNames();
	} else {
		galleryData = null;
	}

	// --- 2. MENU LIST REACTIVITY ---
	$: {
		const ids = getAllWatchIds().filter((id) => getWatchById(id)?.isEnabled);
		allWatches = ids.map(id => {
			const w = getWatchById(id);
			const thumb = w.variants?.[0]?.images?.[0] || '';
			return { ...w, thumb };
		});
	}

	// --- 3. PORTAL ACTION (THE SMOOTH SCROLL FIX) ---
	// Moves the nav dock to document.body to escape GSAP transforms/scroll containers
	function portal(node) {
		if (typeof document !== 'undefined') {
			document.body.appendChild(node);
		}
		return {
			destroy() {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}
		};
	}

	function updateCollectionNames() {
		const allIds = getAllWatchIds().filter((id) => getWatchById(id)?.isEnabled);
		if (!allIds || allIds.length === 0) return;

		const currentIndex = allIds.indexOf(watchData?.id);
		const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % allIds.length;
		const prevIndex = currentIndex === -1 ? allIds.length - 1 : (currentIndex - 1 + allIds.length) % allIds.length;

		nextCollectionName = getWatchById(allIds[nextIndex])?.collection || '';
		prevCollectionName = getWatchById(allIds[prevIndex])?.collection || '';
	}

	// --- 4. HERO ANIMATION LOGIC ---
	async function initWatch() {
		if (typeof window === 'undefined' || !watchData) return;

		// Kill previous animations immediately
		if (ctx) ctx.revert();

		// Wait for the DOM to update via the {#key} block
		await tick();

		registerComponent('watchDetail');
		gsap.registerPlugin(ScrollTrigger);

		ctx = gsap.context(() => {
			gsap.set('.hero-wrapper', { opacity: 0, y: 30 });
			gsap.set('.reveal-text', { y: '100%' });
			gsap.set(['.corner-label'], { opacity: 0 });

			const tl = gsap.timeline({
				onComplete: () => {
					setComponentReady('watchDetail', true);
				}
			});

			tl.to('.hero-wrapper', {
				opacity: 1,
				y: 0,
				duration: 1.2,
				ease: 'power3.out'
			})
				.to('.reveal-text', {
					y: '0%',
					duration: 1,
					stagger: 0.1,
					ease: 'power4.out'
				}, '-=0.8')
				.to('.corner-label', {
					opacity: 1,
					duration: 0.8,
					ease: 'power2.out'
				}, '-=0.5');
		});

		// Ensure scroll resets when a new watch loads
		window.scrollTo(0, 0);
	}

	// --- 5. NAVIGATION HANDLERS ---
	function navigate(direction) {
		const allIds = getAllWatchIds().filter((id) => getWatchById(id)?.isEnabled);
		if (!allIds.length) return;

		const currentIndex = allIds.indexOf(watchData?.id);
		let targetIndex;

		if (direction === 'next') {
			targetIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % allIds.length;
		} else {
			targetIndex = currentIndex === -1 ? allIds.length - 1 : (currentIndex - 1 + allIds.length) % allIds.length;
		}

		isMenuOpen = false;
		goto(`/watches/${allIds[targetIndex]}`);
	}

	function navigateToId(id) {
		if (id === watchData?.id) {
			isMenuOpen = false;
			return;
		}
		isMenuOpen = false;
		goto(`/watches/${id}`);
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// --- 6. REACTIVE INITIALIZATION ---
	// This watches the ID. If it changes, we re-run init.
	// The {#key} block in HTML handles the DOM reset, this handles the JS reset.
	$: if (watchData?.id && watchData.id !== currentWatchId) {
		currentWatchId = watchData.id;
		initWatch();
	}

	onMount(() => {
		// Kill global smoother on this specific page if desired
		// if ($smoother) $smoother.kill();

		// Initial load
		if (watchData?.id) {
			currentWatchId = watchData.id;
			initWatch();
		}
	});

	onDestroy(() => {
		if (ctx) ctx.revert();
		if (typeof window !== 'undefined') ScrollTrigger.killAll();
		unregisterComponent('watchDetail');
	});
</script>

<svelte:head>
	<title>{watchData ? `${watchData.collection}` : 'Watch Not Found'}</title>
</svelte:head>

<div class="nav-dock-container" use:portal>
	<div class="nav-dock-inner">

		{#if isMenuOpen && watchData}
			<div
				transition:fly={{ duration: 400, y: 20, easing: cubicOut }}
				class="pointer-events-auto mb-3 w-[92vw] max-w-md max-h-[50vh] overflow-y-auto glass-panel rounded-2xl p-2 flex flex-col gap-1 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]"
			>
				<div class="px-4 py-2 border-b border-white/10 mb-1 flex justify-between items-center">
					<span class="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Select Timepiece</span>
					<span class="text-[10px] text-zinc-400">{allWatches.length} Available</span>
				</div>

				{#each allWatches as watch (watch.id)}
					<button
						on:click={() => navigateToId(watch.id)}
						class="flex items-center gap-4 p-2 rounded-xl hover:bg-white/20 transition-all duration-200 w-full text-left group"
						class:bg-white-20={watch.id === watchData.id}
					>
						<div
							class="w-12 h-12 bg-white/50 rounded-lg overflow-hidden shrink-0 border border-white/30 shadow-sm group-hover:scale-105 transition-transform">
							{#if watch.thumb}
								<img
									src={watch.thumb}
									alt={watch.collection}
									class="w-full h-full object-cover mix-blend-multiply"
									decoding="async"
									loading="lazy"
									width="48"
									height="48"
								/>
							{/if}
						</div>

						<div class="flex flex-col">
                      <span
						  class="font-serif text-zinc-800 text-lg leading-none group-hover:text-black transition-colors">
                         {watch.collection}
                      </span>
							<span
								class="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 group-hover:text-zinc-700">
                         {watch.subCollection}
                      </span>
						</div>

						{#if watch.id === watchData.id}
							<div class="ml-auto w-1.5 h-1.5 bg-zinc-800 rounded-full shadow-glow"></div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}

		{#if watchData}
			<div
				class="glass-dock px-2 py-2 rounded-full flex items-center gap-2 sm:gap-6 transition-transform duration-300 pointer-events-auto shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
				<button
					on:click={() => navigate('prev')}
					class="group flex items-center gap-4 pl-1 pr-4 py-1 rounded-full hover:bg-white/20 transition-all duration-300"
				>
					<div
						class="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
						<span class="text-lg pb-1 leading-none font-light">←</span>
					</div>
					<div class="hidden sm:flex flex-col items-start text-left">
						<span class="text-[0.5rem] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Prev</span>
						<span
							class="text-xs font-serif text-zinc-800 whitespace-nowrap min-w-[60px] max-w-[100px] truncate">
                      {prevCollectionName || 'Back'}
                   </span>
					</div>
				</button>

				<div
					class="w-[1px] h-8 bg-gradient-to-b from-transparent via-zinc-400/50 to-transparent hidden sm:block"></div>

				<button
					on:click={toggleMenu}
					class="w-10 h-10 rounded-full hover:bg-white/40 flex items-center justify-center transition-colors relative active:scale-95"
					aria-label="View All Watches"
				>
					{#if isMenuOpen}
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							 stroke-width="1.5" class="text-zinc-800">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					{:else}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
							 class="text-zinc-800 opacity-80">
							<rect x="3" y="3" width="7" height="7" rx="1"></rect>
							<rect x="14" y="3" width="7" height="7" rx="1"></rect>
							<rect x="14" y="14" width="7" height="7" rx="1"></rect>
							<rect x="3" y="14" width="7" height="7" rx="1"></rect>
						</svg>
					{/if}
				</button>

				<div
					class="w-[1px] h-8 bg-gradient-to-b from-transparent via-zinc-400/50 to-transparent hidden sm:block"></div>

				<button
					on:click={() => navigate('next')}
					class="group flex items-center gap-4 pl-4 pr-1 py-1 rounded-full hover:bg-white/20 transition-all duration-300"
				>
					<div class="hidden sm:flex flex-col items-end text-right">
						<span class="text-[0.5rem] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Next</span>
						<span
							class="text-xs font-serif text-zinc-800 whitespace-nowrap min-w-[60px] max-w-[100px] truncate">
                      {nextCollectionName || 'Next'}
                   </span>
					</div>
					<div
						class="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
						<span class="text-lg pb-1 leading-none font-light">→</span>
					</div>
				</button>
			</div>
		{/if}
	</div>
</div>

{#if watchData}
	{#key watchData.id}
		<div class="w-full pt-[120px] pb-10 flex justify-center pointer-events-none z-[40]">
			<div
				class="hero-wrapper relative w-fit max-w-[94vw] mx-auto px-6 py-8 md:px-10 md:py-10 mix-blend-multiply dark:mix-blend-normal">
				<div class="corner-label absolute top-0 left-0 pt-2 pl-2">
                    <span
						class="block text-[0.6rem] sm:text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-zinc-500 font-sans">
                        Meet
                    </span>
				</div>

				<div class="text-center z-10">
					<div class="overflow-hidden px-1 pb-4 sm:pb-6">
						<h1 class="reveal-text text-[13vw] sm:text-[10vw] md:text-[6rem] lg:text-[7rem] leading-[0.8] font-serif font-medium text-zinc-900 tracking-tighter capitalize text-balance break-words">
							{watchData.collection}
						</h1>
					</div>

					<div class="overflow-hidden mt-1 sm:mt-2">
						<h2 class="reveal-text text-xs sm:text-sm md:text-lg font-light tracking-[0.3em] uppercase text-zinc-500">
							{watchData.subCollection}
						</h2>
					</div>
				</div>

				<div class="corner-label absolute bottom-0 right-0 pb-2 pr-2 flex items-center gap-2 sm:gap-3">
					<span
						class="text-[0.6rem] sm:text-xs md:text-sm tracking-widest text-zinc-500 font-semibold uppercase">By</span>
					<img src="{logoImg}" alt="ASIS" class="h-3 sm:h-4 md:h-5 w-auto opacity-70" />
				</div>
			</div>
		</div>

		<div class="relative w-full z-20 pb-40">
			<Gallery {galleryData} />
		</div>
	{/key}

{:else}
	<div class="min-h-screen flex items-center justify-center bg-zinc-50">
		<div class="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
	</div>
{/if}

<style>
	:global(.font-serif) {
		font-family: 'Playfair Display', serif;
	}

	/* Updated Dock Styles
	   Removed the 'nuclear' !important hacks because
	   the 'use:portal' action handles the positioning logic cleanly now.
	*/
	.nav-dock-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 9999;
		pointer-events: none;
		padding-bottom: 1.5rem;
	}

	@media (min-width: 640px) {
		.nav-dock-container {
			padding-bottom: 2rem;
		}
	}

	.nav-dock-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
		animation: fadeInDock 1s ease-out 0.6s both;
	}

	@keyframes fadeInDock {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.glass-dock {
		background: rgba(255, 255, 255, 0.4);
		backdrop-filter: blur(100px) saturate(180%);
		-webkit-backdrop-filter: blur(100px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.4);
	}

	.glass-panel {
		background: rgba(255, 255, 255, 0.65);
		/* Slightly reduced blur for performance */
		backdrop-filter: blur(100px) saturate(200%);
		-webkit-backdrop-filter: blur(100px) saturate(200%);
		border: 1px solid rgba(255, 255, 255, 0.5);
		/* Important: hints to browser to optimize rendering for transition */
		will-change: transform, opacity;
	}

	.shadow-glow {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	}

	.glass-panel::-webkit-scrollbar {
		width: 4px;
	}

	.glass-panel::-webkit-scrollbar-track {
		background: transparent;
	}

	.glass-panel::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}
</style>