<script>
	import { onMount, tick } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { goto } from '$app/navigation';
	import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
	import { page } from '$app/stores';
	import logoImg from '$lib/assets/images/AS IS.png';
	import { isLoading } from '$lib/stores/loadingStore.js';

	let menuElement;
	let menuButton;
	let isMenuOpen = false;
	let headerElement;
	let lastScrollY = 0;

	onMount(() => {
		gsap.registerPlugin(ScrollToPlugin);
	});

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;

		if (isMenuOpen) {
			gsap.timeline()
				.set(menuElement, { display: 'block', height: 0, overflow: 'hidden' })
				.to(menuElement, {
					height: 'auto',
					duration: 0.5,
					ease: 'power2.out'
				})
				.fromTo('.mobile-nav-item',
					{ opacity: 0, y: -10 },
					{ opacity: 1, y: 0, duration: 0.3, stagger: 0.1 },
					'-=0.3'
				);
		} else {
			gsap.timeline({
				onComplete: () => gsap.set(menuElement, { display: 'none' })
			})
				.to('.mobile-nav-item',
					{ opacity: 0, y: -10, duration: 0.2 }
				)
				.to(menuElement,
					{ height: 0, duration: 0.4, ease: 'power2.inOut' },
					'-=0.1'
				);
		}
	};

	const waitForLoadingToFinish = () => {
		return new Promise((resolve) => {
			const unsubscribe = isLoading.subscribe(value => {
				if (value === false) {
					unsubscribe();
					resolve();
				}
			});
		});
	};

	// make async so we can await goto and guarantee order
	const handleClick = async (targetPage, divID) => {
		// Close mobile menu if open
		if (isMenuOpen) {
			toggleMenu();
		}

		const hasAnchor = typeof divID === 'string' && divID.trim().length > 0;
		const scrollToTarget = hasAnchor ? `#${divID.trim()}` : 0;

		// 1. If we are ALREADY on the page, just scroll
		if ($page.url.pathname === targetPage) {
			gsap.to(window, { duration: 1, scrollTo: scrollToTarget });
			return;
		}

		// 2. If we are on a DIFFERENT page, Navigate -> Wait -> Scroll
		try {
			await goto(targetPage);

			// Wait for Svelte to update the DOM structure
			await tick();

			// Use a small timeout to allow layout painting to finish
			setTimeout(async () => {
				try {
					// Check if target exists before scrolling (prevents GSAP warnings)
					const targetExists = hasAnchor ? document.querySelector(scrollToTarget) : true;
					// loading finishes after this but gsap takes longer to load, hence a timeout of one additional second
					// seems to work for now
					await waitForLoadingToFinish();
					// if (targetExists) {
					// 	console.log('Target Exists: ', targetExists, scrollToTarget);
					// 	gsap.to(window, { duration: 1, scrollTo: scrollToTarget });
					// } else {
					console.log('Target doesnt Exists: ', targetExists, scrollToTarget);
					console.log('Loading Finished Scrolling Now');
					setTimeout(() => {
						gsap.to(window, { duration: 0.5, scrollTo: scrollToTarget });
					}, 1000);
					// }
				} catch (err) {
					console.warn('GSAP scroll failed:', err);
				}
			}, 100); // 100ms delay is usually imperceptible but ensures stability

		} catch (navErr) {
			console.error('Navigation failed:', navErr);
		}
	};

	const handleScroll = () => {
		// Don't hide the navbar if the mobile menu is currently open
		if (isMenuOpen) return;

		const currentScrollY = window.scrollY;
		const headerHeight = headerElement?.offsetHeight || 80;

		// If at the very top, always show
		if (currentScrollY <= 0) {
			gsap.to(headerElement, { y: 0, duration: 0.3, ease: 'power2.out' });
			lastScrollY = currentScrollY;
			return;
		}

		// Determine direction
		if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
			// Scrolling DOWN -> Hide Header
			gsap.to(headerElement, { y: '-100%', duration: 0.3, ease: 'power2.out' });
		} else {
			// Scrolling UP -> Show Header
			gsap.to(headerElement, { y: 0, duration: 0.3, ease: 'power2.out' });
		}

		lastScrollY = currentScrollY;
	};
</script>

<svelte:window on:scroll={handleScroll} />

<header
	bind:this={headerElement}
	class="fixed top-0 left-0 w-full z-50">
	<nav
		class="flex flex-wrap items-center justify-between min-h-[4rem] w-full py-4 md:py-0 px-4 text-lg text-[#5cc6c9] bg-[#2d6f71] shadow-md
				relative">

		<!-- Center: Navigation Links (Desktop) -->
		<div class="hidden w-full md:flex md:items-center md:justify-center md:flex-1 -mr-[3rem]" id="menu">
			<ul class="text-base secondary-font uppercase font-bold text-white md:flex md:justify-center md:gap-16">
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "landing")}
					>
						Home
					</a>
				</li>
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "collections")}
					>
						Collections
					</a>
				</li>
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "collaboration")}
					>
						Collaboration
					</a>
				</li>
				<!--				<li>-->
				<!--					<a-->
				<!--						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"-->
				<!--						on:click|preventDefault={() => handleClick("/", "footer")}-->
				<!--					>-->
				<!--						Contact-->
				<!--					</a>-->
				<!--				</li>-->
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "CSR")}
					>
						CSR
					</a>
				</li>
			</ul>
		</div>

		<!-- Right: Logo -->
		<div
			class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white h-[3.7rem] w-[3.7rem] rounded-full flex items-center justify-center">
			<a on:click|preventDefault={() => handleClick("/", "landing")}>
				<img
					alt="Logo"
					class="h-[26px] w-auto"
					src={logoImg}
				/>
			</a>
		</div>

		<!-- Mobile Menu Button -->
		<button
			aria-label="Toggle menu"
			bind:this={menuButton}
			class="h-6 w-6 cursor-pointer md:hidden block order-first"
			on:click={toggleMenu}
		>
			<svg
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M4 6h16M4 12h16M4 18h16"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
				/>
			</svg>
		</button>

		<!-- Mobile Menu -->
		<div
			bind:this={menuElement}
			class="hidden w-full md:hidden overflow-hidden"
			id="mobile-menu"
		>
			<ul class="pt-4 text-base secondary-font uppercase font-bold text-white">
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "landing")}
					>
						Home
					</a>
				</li>
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "collections")}
					>
						Collections
					</a>
				</li>
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "collaboration")}
					>
						Collaboration
					</a>
				</li>
<!--				<li>-->
<!--					<a-->
<!--						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"-->
<!--						on:click|preventDefault={() => handleClick("/", "footer")}-->
<!--					>-->
<!--						Contact-->
<!--					</a>-->
<!--				</li>-->
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "CSR")}
					>
						CSR
					</a>
				</li>
			</ul>
		</div>
	</nav>
</header>

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
