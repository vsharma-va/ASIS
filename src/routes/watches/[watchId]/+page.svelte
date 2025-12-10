<script>
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Gallery from '$lib/components/Gallery.svelte';
	import { setComponentReady, registerComponent, unregisterComponent } from '$lib/stores/loadingStore';
	import logoImg from '$lib/assets/images/AS IS.png';

	// NEW: import helpers to navigate watches
	import { getAllWatchIds, getWatchById } from '$lib/stores/watchData';

	// receive SvelteKit load data reactively
	export let data;

	// ensure variables exist for SSR
	let watchData = null;
	let galleryData = null;

	// NEW: state for button hover and collection names
	let isPrevHovered = false;
	let isNextHovered = false;
	let prevCollectionName = '';
	let nextCollectionName = '';

	// reactive watchData so it updates when SvelteKit provides new props
	$: watchData = data?.watch ?? null;

	// reactive galleryData derived from watchData
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
	} else {
		galleryData = null;
	}

	// Update collection names whenever watchData changes
	$: if (watchData) {
		updateCollectionNames();
	}

	function updateCollectionNames() {
		const allIds = getAllWatchIds().filter((id) => getWatchById(id)?.isEnabled);
		if (!allIds || allIds.length === 0) return;

		const currentIndex = allIds.indexOf(watchData?.id);

		// Get next collection name
		const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % allIds.length;
		const nextId = allIds[nextIndex];
		const nextWatch = getWatchById(nextId);
		nextCollectionName = nextWatch ? `${nextWatch.collection} ${nextWatch.subCollection}` : '';

		// Get prev collection name
		const prevIndex = currentIndex === -1 ? allIds.length - 1 : (currentIndex - 1 + allIds.length) % allIds.length;
		const prevId = allIds[prevIndex];
		const prevWatch = getWatchById(prevId);
		prevCollectionName = prevWatch ? `${prevWatch.collection} ${prevWatch.subCollection}` : '';
	}

	let ctx = null;
	let isMobile = false;
	let handleResize;

	// animation / init function — call this on mount AND when watchData changes
	function initWatch() {
		// only run on client and only if we have watchData
		if (typeof window === 'undefined' || !watchData) return;

		// if there was a previous GSAP context, revert it
		if (ctx) {
			try {
				ctx.revert();
			} catch (e) {
				console.warn('Error reverting previous gsap context', e);
			}
			ctx = null;
		}

		// register component (safe to call multiple times)
		registerComponent('watchDetail');

		// ensure ScrollTrigger plugin is registered
		gsap.registerPlugin(ScrollTrigger);

		isMobile = window.innerWidth <= 768;

		// ensure resize listener is present
		if (!handleResize) {
			handleResize = () => {
				isMobile = window.innerWidth < 768;
			};
			window.addEventListener('resize', handleResize, { passive: true });
		}

		// create a new gsap context for this watch
		ctx = gsap.context(() => {
			gsap.set(['.LandingBG', '.LandingTextElem'], {
				opacity: 0,
				force3D: true,
				backfaceVisibility: 'hidden',
				perspective: 1000
			});

			gsap.set('.LandingBG', {
				scale: isMobile ? 1.08 : 1.15,
				transformOrigin: 'center center'
			});

			const tl = gsap.timeline();
			tl.to('.LandingBG', {
				scale: 1,
				opacity: 1,
				duration: 1.2,
				ease: 'power2.inOut',
				delay: 0.1
			}).to(
				'.LandingTextElem',
				{
					opacity: 1,
					y: 0,
					stagger: isMobile ? 0.05 : 0.1,
					duration: 0.8,
					ease: 'power2.inOut',
					onComplete: () => {
						// signal that this component is ready for the loader handshake
						setComponentReady('watchDetail', true);
					}
				},
				'-=0.6'
			);
		});
	}

	// Navigate to next enabled watch in loop
	function goToNextWatch() {
		const allIds = getAllWatchIds().filter((id) => getWatchById(id)?.isEnabled);
		if (!allIds || allIds.length === 0) return;

		const currentIndex = allIds.indexOf(watchData?.id);
		const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % allIds.length;
		const nextId = allIds[nextIndex];

		// navigate to the next watch page
		goto(`/watches/${nextId}`);
	}

	// Navigate to previous enabled watch in loop (NEW)
	function goToPrevWatch() {
		const allIds = getAllWatchIds().filter((id) => getWatchById(id)?.isEnabled);
		if (!allIds || allIds.length === 0) return;

		const currentIndex = allIds.indexOf(watchData?.id);
		// If currentIndex is -1, default to 0 so prev resolves to last item
		const prevIndex = currentIndex === -1 ? allIds.length - 1 : (currentIndex - 1 + allIds.length) % allIds.length;
		const prevId = allIds[prevIndex];

		// navigate to the previous watch page
		goto(`/watches/${prevId}`);
	}

	// onMount: initialize for the first watch
	onMount(() => {
		initWatch();
	});

	// reactively re-init whenever the watch id changes (client-side navigation)
	$: if (typeof window !== 'undefined' && watchData?.id) {
		// microtask to ensure DOM is updated before GSAP targets
		Promise.resolve().then(() => {
			initWatch();
		});
	}

	onDestroy(() => {
		if (ctx) {
			try {
				ctx.revert();
			} catch (e) {
				console.warn('Error reverting gsap context on destroy', e);
			}
			ctx = null;
		}
		if (handleResize) {
			window.removeEventListener('resize', handleResize);
			handleResize = null;
		}
		// make sure ScrollTrigger instances are killed on client
		if (typeof window !== 'undefined' && ScrollTrigger) {
			try {
				ScrollTrigger.killAll();
			} catch (e) {
				// ignore
			}
		}
		unregisterComponent('watchDetail');
	});
</script>

<svelte:head>
	<title>{watchData ? `${watchData.collection}` : 'Watch Not Found'}</title>
	<meta name="description" content={watchData?.watchDescription || 'Premium luxury timepiece'} />
</svelte:head>

{#if watchData}
	<div
		class="LandingSection h-screen w-full relative flex justify-center items-start pt-[5%] sm:pt-[3%] md:pt-[5%] overflow-hidden bg-gradient mt-[3rem] -mb-[80vh]">

		<div
			class="LandingTextElemContainer w-full h-full flex flex-col justify-center items-center z-10 text-white/90 px-4 sm:px-0 -mt-[20rem]">
			<div class="relative w-full flex justify-center items-center">

				<div
					class="nav-wrap nav-prev"
					on:mouseenter={() => isPrevHovered = true}
					on:mouseleave={() => isPrevHovered = false}
					on:focusin={() => isPrevHovered = true}
					on:focusout={() => isPrevHovered = false}
				>
					<button
						class="nav-circle text-sm font-medium secondary-font"
						on:click={goToPrevWatch}
						aria-label={prevCollectionName ? `Previous: ${prevCollectionName}` : 'Previous collection'}
						type="button"
						tabindex="0"
						disabled={!prevCollectionName}
					>
						←
					</button>
					<div class="nav-label" aria-hidden={!isPrevHovered}>
						{prevCollectionName}
					</div>
				</div>

				<div class="relative w-fit max-w-[60vw] sm:max-w-[70vw] mx-auto LandingBG LandingTextElem">

					<div class="absolute -top-5 sm:-top-6 left-0 uppercase secondary-font text-xs sm:text-sm">
						Meet
					</div>

					<div class="text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[5.5rem]
                   primary-font font-[600] leading-[0.8] capitalize text-center">
						{watchData.collection + " " + watchData.subCollection}
					</div>

					<div class="absolute -bottom-6 sm:-bottom-8 right-0 uppercase secondary-font text-xs sm:text-sm">
						<div class="flex items-center gap-2">
							<span class="align-text-bottom">BY</span>
							<img src="{logoImg}" alt="ASIS" class="h-4 sm:h-6 w-auto object-contain" />
						</div>
					</div>
				</div>

				<div
					class="nav-wrap nav-next"
					on:mouseenter={() => isNextHovered = true}
					on:mouseleave={() => isNextHovered = false}
					on:focusin={() => isNextHovered = true}
					on:focusout={() => isNextHovered = false}
				>
					<button
						class="nav-circle text-sm font-medium secondary-font"
						on:click={goToNextWatch}
						aria-label={nextCollectionName ? `Next: ${nextCollectionName}` : 'Next collection'}
						type="button"
						tabindex="0"
						disabled={!nextCollectionName}
					>
						→
					</button>
					<div class="nav-label" aria-hidden={!isNextHovered}>
						{nextCollectionName}
					</div>
				</div>

			</div>
		</div>
	</div>
	<Gallery {galleryData} />
{:else}
	<!-- Loading State -->
	<div
		class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
			<p class="text-white/70 text-lg">Loading watch details...</p>
		</div>
	</div>
{/if}

<style>
	button .collection-name {
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
	}

	/* NAV WRAPPER */
	.nav-wrap {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 48px;
		height: 48px;
		z-index: 10;
		display: flex;
		justify-content: center; /* Center align content for the label below */
	}

	@media (max-width: 640px) {
		.nav-wrap {
			width: 40px;
			height: 40px;
		}
	}

	/* Position wrappers near edges */
	.nav-prev {
		left: clamp(20px, 5vw, 120px);
	}

	.nav-next {
		right: clamp(20px, 5vw, 120px);
	}

	/* CIRCLE BUTTON */
	.nav-circle {
		width: 100%;
		height: 100%;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.95);
		color: #0f172a;
		border: none;
		box-shadow: 0 8px 22px rgba(2, 6, 23, 0.08);
		font-weight: 700;
		font-size: 1.05rem;
		cursor: pointer;
		transition: transform 140ms ease, opacity 140ms ease;
		z-index: 20; /* Ensure button sits above label area if overlapping */
	}

	.nav-circle:disabled {
		opacity: 0.45;
		cursor: default;
		pointer-events: none;
	}

	/* LABEL: Positioned BELOW the button */
	.nav-label {
		position: absolute;
		top: 100%; /* Push below button */
		left: 50%; /* Center horizontally relative to button */
		transform: translateX(-50%) translateY(-10px); /* Start slightly up and centered */

		white-space: nowrap;
		overflow: hidden;
		max-width: 0; /* Animate width */
		opacity: 0; /* Animate opacity */

		margin-top: 12px; /* Spacing from button */
		padding: 8px 12px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 0 8px 22px rgba(2, 6, 23, 0.06);
		color: #0f172a;
		font-weight: 600;
		font-size: 0.85rem;
		text-align: center;
		pointer-events: none;
		z-index: 19;

		transition: max-width 300ms cubic-bezier(.2, .8, .2, 1),
		opacity 200ms ease,
		transform 300ms cubic-bezier(.2, .8, .2, 1);
	}

	/* HOVER STATE */
	.nav-wrap:hover .nav-label,
	.nav-wrap:focus-within .nav-label {
		max-width: 200px; /* Limit width */
		opacity: 1;
		transform: translateX(-50%) translateY(0); /* Drop into place */
	}

	/* Button hover scale */
	.nav-wrap:hover .nav-circle,
	.nav-wrap:focus-within .nav-circle {
		transform: scale(1.05);
	}


	/* Small-screen adjustments */
	@media (max-width: 640px) {
		.nav-label {
			padding: 8px 10px;
			font-size: 0.9rem;
		}

		.nav-wrap.nav-prev {
			left: 8px;
		}

		.nav-wrap.nav-next {
			right: 8px;
		}

		.nav-label {
			max-width: 220px;
		}
	}

	/* subtle hover scale for tactile feel */
	.nav-wrap:hover .nav-circle,
	.nav-wrap:focus-within .nav-circle {
		transform: scale(1.03);
	}


</style>