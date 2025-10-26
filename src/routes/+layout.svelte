<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { isLoading, componentStates, expectedComponents } from '$lib/stores/loadingStore';

	let { children } = $props();
	let smoother;

	// Debug logging
	$effect(() => {
		console.log('Loading state:', $isLoading);
		console.log('Expected components:', Array.from($expectedComponents));
		console.log('Component states:', $componentStates);
	});

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
	}

	onMount(() => {
		// Explicitly define the wrapper and content for ScrollSmoother for stability
		smoother = ScrollSmoother.create({
			wrapper: '#smooth-wrapper',
			content: '#smooth-content',
			smooth: 2,
			smoothTouch: 0.5,
			ease: 'sine',
			effects: true
		});

		return () => {
			smoother?.kill();
		};
	});

	afterNavigate(() => {
		// Reset scroll position after navigation
		if (smoother) {
			smoother.scrollTo(0, false);
		}
		// Fallback for immediate reset
		window.scrollTo(0, 0);
	});
</script>

<!-- Page Transition Overlay - Slides in/out, sits below loader -->
<PageTransition />

<!-- Global Loading Overlay - Shows on top of transition while content loads -->
<div class="loading-overlay" class:hidden={!$isLoading}>
	<div class="newtons-cradle">
		<div class="newtons-cradle__dot"></div>
		<div class="newtons-cradle__dot"></div>
		<div class="newtons-cradle__dot"></div>
		<div class="newtons-cradle__dot"></div>
	</div>
</div>

<!-- The Navbar is placed outside the scrolling area to keep it fixed -->
<Navbar />

<!-- These wrapper and content divs are for GSAP ScrollSmoother -->
<div id="smooth-wrapper">
	<div id="smooth-content">
		{@render children()}
	</div>
</div>

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
		z-index: 10000; /* Above transition so it shows on top while loading */
		transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
	}

	.loading-overlay.hidden {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}

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