<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { goto } from '$app/navigation';
	import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
	import { page } from '$app/stores';

	// Variables to hold element references
	let navElement;
	let closeButton;
	let timeline;

	onMount(() => {
		gsap.registerPlugin(ScrollToPlugin);
		// Initialize the GSAP timeline once the component is mounted
		// It's paused and reversed by default, ready for the first open click
		timeline = gsap.timeline({
			paused: true,
			reversed: true,
			defaults: { duration: 0.5, ease: 'expo.inOut' }
		});

		// Define the animation sequence
		timeline
			.to(navElement, { right: 0 })
			.to(navElement, { height: '100vh' }, '-=0.1')
			// Target the nav links, close button, and header by class
			.to('.nav-link', { opacity: 1, pointerEvents: 'all', stagger: 0.2 }, '-=0.8')
			.to(closeButton, { opacity: 1, pointerEvents: 'all' }, '-=0.8')
			.to('.nav-header', { opacity: 1 }, '-=1');
	});

	// Functions to control the timeline
	const openNav = () => timeline?.play();
	const closeNav = () => timeline?.reverse();
	const handleClick = (targetPage, divID) => {
		closeNav();

		// Determine the scroll target: 0 for top, or the specific ID
		const scrollToTarget = divID === '#' ? 0 : `#${divID}`; // <--- CHANGE HERE

		if ($page.url.pathname === targetPage) {
			// Already on the page, just scroll
			gsap.to(window, { duration: 1, scrollTo: scrollToTarget }); // <--- CHANGE HERE
		} else {
			// Navigate first, then scroll
			goto(targetPage).then(() => {
				requestAnimationFrame(() => {
					gsap.to(window, { duration: 1, scrollTo: scrollToTarget }); // <--- CHANGE HERE
				});
			});
		}
	};
</script>

<div
	class="fixed left-[2%] top-[2%] z-10 h-[22px] w-[30px] cursor-pointer"
	on:click={openNav}
	aria-label="Open navigation menu"
	role="button"
>
	<div
		class="relative top-[9px] h-[4px] w-[30px] bg-black
           before:absolute before:top-[-9px] before:h-[4px] before:w-[30px] before:bg-black before:content-['']
           after:absolute after:top-[9px] after:h-[4px] after:w-[30px] after:bg-black after:content-['']"
	/>
</div>

<nav
	bind:this={navElement}
	class="fixed z-10 flex h-[30px] w-full items-center justify-center bg-black"
	style="right: -100vw;"
>
	<div
		bind:this={closeButton}
		class="pointer-events-none absolute left-[2%] top-[2%] h-[30px] w-[30px] cursor-pointer opacity-0"
		on:click={closeNav}
		aria-label="Close navigation menu"
		role="button"
	>
		<div
			class="relative h-full w-full
               hover:before:bg-red-600 hover:after:bg-red-600
               before:absolute before:top-1/2 before:h-[4px] before:w-[30px] before:-translate-y-1/2 before:-rotate-45 before:bg-white before:transition-colors before:duration-500 before:content-['']
               after:absolute after:top-1/2 after:h-[4px] after:w-[30px] after:-translate-y-1/2 after:rotate-45 after:bg-white after:transition-colors after:duration-500 after:content-['']"
		/>
	</div>

	<ul class="list-none text-center">
		<li class="my-12">
			<a on:click|preventDefault={() => {handleClick("/","landing")}}
			   class="nav-link pointer-events-none relative text-2xl font-medium text-gray-50
			   		  no-underline opacity-0 primary-font uppercase
			   		  after:absolute after:-bottom-2.5 after:left-0 after:h-[3px] after:w-full
			   		  after:origin-left after:scale-x-0 after:rounded-md after:bg-white after:transition-transform
			   		  after:duration-500 after:ease-in-out after:content-[''] hover:after:scale-x-100">
				Home
			</a>
		</li>
		<li class="my-12">
			<a on:click|preventDefault={() => {handleClick("/","collections")}}
			   class="nav-link primary-font uppercase pointer-events-none relative text-2xl font-medium text-gray-50 no-underline opacity-0 after:absolute after:-bottom-2.5 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:rounded-md after:bg-white after:transition-transform after:duration-500 after:ease-in-out after:content-[''] hover:after:scale-x-100">
				Collections
			</a>
		</li>
		<li class="my-12">
			<a on:click|preventDefault={() => {handleClick("/","footer")}}
			   class="nav-link primary-font uppercase pointer-events-none relative text-2xl font-medium text-gray-50 no-underline opacity-0 after:absolute after:-bottom-2.5 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:rounded-md after:bg-white after:transition-transform after:duration-500 after:ease-in-out after:content-[''] hover:after:scale-x-100">
				Contact
			</a>
		</li>
	</ul>
</nav>
