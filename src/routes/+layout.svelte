<script>
	import '../app.css';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import ContactForm from '$lib/components/contactForm.svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import {
		isLoading,
		componentStates,
		expectedComponents,
		startNavigation,
		smoother
	} from '$lib/stores/loadingStore';

	let { children } = $props();
	const currentUrl = $derived(page.url.href);
	let isWatchesPage = $derived(page.url.pathname.includes('watches'));

	// Debug logging
	$effect(() => {
		console.log('Loading state:', $isLoading);
		console.log('Expected components:', Array.from($expectedComponents));
		console.log('Component states:', $componentStates);
		// gallery page needs the bottom navbar to be sticky, therefore I have removed smoothscroll from it
		if (isWatchesPage) {
			if ($smoother) {
				$smoother.kill();
				$smoother = null;
			}
		} else {
			tick().then(() => {
				$smoother = ScrollSmoother.create({
					wrapper: '#smooth-wrapper',
					content: '#smooth-content',
					smooth: 2
				});
			});
		}
	});

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
	}

	if (typeof window !== 'undefined') {
		beforeNavigate(() => {
			// mark navigation in progress (starts loader + timer)
			startNavigation();
		});
	}

	onMount(() => {
		// Explicitly define the wrapper and content for ScrollSmoother for stability

		return () => {
			$smoother?.kill();
		};
	});

	afterNavigate(() => {
		// Reset scroll position after navigation
		if ($smoother) {
			$smoother.scrollTo(0, false);
		}
		// Fallback for immediate reset
		window.scrollTo(0, 0);
		// Note: we *do not* call completeNavigation() here. setComponentReady() will call completeNavigation()
		// once components mark themselves ready. For pages with no expected components, setComponentReady()
		// logic will also call completeNavigation() automatically.
	});
</script>

<!-- Page Transition Overlay - Slides in/out, sits below loader -->
<PageTransition />

<!-- Global Loading Overlay - Shows on top of transition while content loads -->
{#if $isLoading}
	<div class="loading-overlay">
		<div class="newtons-cradle" aria-hidden="true">
			<div class="newtons-cradle__dot"></div>
			<div class="newtons-cradle__dot"></div>
			<div class="newtons-cradle__dot"></div>
			<div class="newtons-cradle__dot"></div>
		</div>
	</div>
{/if}

<!-- The Navbar is placed outside the scrolling area to keep it fixed -->
<Navbar />
<ContactForm />

<!-- These wrapper and content divs are for GSAP ScrollSmoother -->
{#if !currentUrl.includes("watches")}
	<div id="smooth-wrapper">
		<div id="smooth-content">
			{@render children()}
		</div>
	</div>
{:else}
	{@render children()}
{/if}

<style>
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 99999; /* Above everything while loading */
		/* keep a short fade-in/out if you like: */
		transition: opacity 0.22s ease-out;
	}

	/* When the overlay is removed from the DOM by the {#if}, we don't rely on class toggles.
	   If you prefer to animate out before removing, implement a local transition / animate directive. */

	.newtons-cradle {
		--uib-size: 40px;
		--uib-speed: 1.2s;
		--uib-color: #474554;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--uib-size);
		height: var(--uib-size);
	}

	@media (min-width: 640px) {
		.newtons-cradle {
			--uib-size: 50px;
		}
	}

	.newtons-cradle__dot {
		position: relative;
		display: flex;
		align-items: center;
		height: 100%;
		width: 25%;
		transform-origin: center top;
	}

	.newtons-cradle__dot::after {
		content: '';
		display: block;
		width: 100%;
		height: 25%;
		border-radius: 50%;
		background-color: var(--uib-color);
	}

	.newtons-cradle__dot:first-child {
		animation: swing var(--uib-speed) linear infinite;
	}

	.newtons-cradle__dot:last-child {
		animation: swing2 var(--uib-speed) linear infinite;
	}

	@keyframes swing {
		0% {
			transform: rotate(0deg);
			animation-timing-function: ease-out;
		}
		25% {
			transform: rotate(70deg);
			animation-timing-function: ease-in;
		}
		50% {
			transform: rotate(0deg);
			animation-timing-function: linear;
		}
	}

	@keyframes swing2 {
		0% {
			transform: rotate(0deg);
			animation-timing-function: linear;
		}
		50% {
			transform: rotate(0deg);
			animation-timing-function: ease-out;
		}
		75% {
			transform: rotate(-70deg);
			animation-timing-function: ease-in;
		}
	}
</style>
