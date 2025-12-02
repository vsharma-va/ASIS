<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { goto } from '$app/navigation';
	import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
	import { page } from '$app/stores';
	import logoImg from '$lib/assets/images/AS IS.png';

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

	const handleClick = (targetPage, divID) => {
		// Close mobile menu if open
		if (isMenuOpen) {
			toggleMenu();
		}

		const scrollToTarget = divID === '#' ? 0 : `#${divID}`;

		if ($page.url.pathname === targetPage) {
			gsap.to(window, { duration: 1, scrollTo: scrollToTarget });
		} else {
			goto(targetPage).then(() => {
				requestAnimationFrame(() => {
					gsap.to(window, { duration: 1, scrollTo: scrollToTarget });
				});
			});
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
				relative ">

		<!-- Center: Navigation Links (Desktop) -->
		<div class="hidden w-full md:flex md:items-center md:justify-center md:flex-1" id="menu">
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
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "footer")}
					>
						Contact
					</a>
				</li>
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "footer")}
					>
						CSR
					</a>
				</li>
			</ul>
		</div>

		<!-- Right: Logo -->
		<div
			class="absolute right-2 top-0 transform bg-white h-[4.2rem] w-[4.2rem] rounded-full flex items-center justify-center">
			<a on:click|preventDefault={() => handleClick("/", "landing")}>
				<img
					src="{logoImg}"
					alt="Logo"
					class="h-8 w-auto"
				/>
			</a>
		</div>

		<!-- Mobile Menu Button -->
		<button
			bind:this={menuButton}
			on:click={toggleMenu}
			class="h-6 w-6 cursor-pointer md:hidden block order-first"
			aria-label="Toggle menu"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
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
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "footer")}
					>
						Contact
					</a>
				</li>
				<li>
					<a
						class="md:p-4 py-2 block hover:text-[#5cc6c9] cursor-pointer transition-colors duration-300"
						on:click|preventDefault={() => handleClick("/", "footer")}
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