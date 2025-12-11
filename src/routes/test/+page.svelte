<script>
	// ---------------------------------------------------------
	// DATA
	// ---------------------------------------------------------
	const watches = [
		{
			id: 1,
			name: 'The Invisible Round',
			brand: 'AS-IS',
			price: '10 Variations',
			image: 'src/lib/assets/collection_watch_faces/invisible_petite_round.png',
			tagline: 'Petite',
			description: 'A Gemstone Symphony Crafted in the Art of Invisible Setting Round Watch',
			year: '2025',
			specs: ['10 Variations', 'Aligator/ Vegan', '33mm']
		},
		{
			id: 2,
			name: 'The Invisible Round',
			brand: 'AS-IS',
			price: '10 Variations',
			image: 'src/lib/assets/collection_watch_faces/invisible_petite_round_grande.png',
			tagline: 'Grande',
			description: 'A Gemstone Symphony Crafted in the Art of Invisible Setting Round Watch',
			year: '2025',
			specs: ['10 Variations', 'Aligator/Vegan', '40mm']
		},
		{
			id: 3,
			name: 'The Mosaic',
			brand: 'AS-IS',
			price: '3 Variations',
			image: 'src/lib/assets/collection_watch_faces/the_mosiac.png',
			tagline: 'Mosaic Art',
			description: 'A Vivid Arrangement of Colors in Mosaic Art',
			year: '2025',
			specs: ['3 Variations', 'Aligator/ Vegan', '49 X 28 MM']
		},
		{
			id: 4,
			name: 'The Twin-Rainbow',
			brand: 'AS-IS',
			price: '7 Variations',
			image: 'src/lib/assets/collection_watch_faces/the_twin-rainbow.png',
			tagline: 'Rainbow',
			description: 'A Colorful Spectrum Capturing the Rare Essence of a Twin Rainbow Watch',
			year: '2025',
			specs: ['7 Variations', 'Aligator/ Vegan', '38 MM']
		}
	];
</script>

<style>
	/* Layout */
	.bg-gradient-custom {
		background: linear-gradient(90deg, #E2D9DC 0%, #DED5D8 50%, #B9B0B3 100%);
	}

	/* Global Scroll Behavior */
	:global(html) {
		scroll-behavior: smooth;
	}
</style>

<!-- Main Wrapper -->
<div
	class="relative min-h-screen bg-gradient-custom text-black overflow-x-hidden selection:bg-stone-800 selection:text-[#E2D9DC]">

	<!-- Main Content Flow -->
	<main class="flex flex-col w-full">

		<!-- INTRO SECTION -->
		<section class="min-h-screen w-full flex flex-col justify-center items-center relative px-6 md:px-24 py-32">
			<div class="text-center relative z-10">
				<p class="secondary-font text-xs uppercase tracking-[0.3em] text-stone-500 mb-6">Volume I — 2025</p>
				<h2 class="footer-font text-[18vw] md:text-[15vw] leading-[0.85] text-stone-800 select-none">
					AS-IS<br>COLLECTION
				</h2>
				<div class="mt-12 max-w-md mx-auto">
					<p class="primary-font text-2xl md:text-3xl italic text-stone-600 leading-relaxed">
						"Time is the only true luxury. How you measure it defines who you are. Placeholder"
					</p>
				</div>
			</div>

			<!-- Decorative Spinning Circles (Fixed behind) -->
			<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  opacity-5 pointer-events-none">
				<div
					class="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] border border-stone-800 rounded-full animate-[spin_60s_linear_infinite]"></div>
			</div>
		</section>

		<!-- WATCH SECTIONS -->
		{#each watches as watch, i}
			<section
				class="min-h-screen w-full flex items-center justify-center relative px-4 md:px-0 py-24 border-t border-stone-800/5 group">

				<!-- Background Large Typography -->
				<div
					class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span class="footer-font text-[30vw] text-stone-400/10 whitespace-nowrap blur-[1px]">
                        {watch.brand.split(' ')[0]}
                    </span>
				</div>

				<!-- Main Grid Layout -->
				<div
					class="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center relative z-10">

					<!-- Text Left -->
					<div
						class="md:col-span-4 md:text-right order-2 md:order-1 flex flex-col justify-center items-start md:items-end space-y-6">
						<div
							class="bg-stone-800 text-[#E2D9DC] px-4 py-1 rounded-full secondary-font text-xs inline-block mb-2 shadow-lg">
							Lot No. 0{i + 1}
						</div>
						<h3 class="primary-font text-5xl md:text-6xl lg:text-7xl text-stone-900 leading-[0.9]">
							{watch.name}
						</h3>
						<p class="primary-font text-xl italic text-stone-600 max-w-xs md:ml-auto">
							"{watch.tagline}"
						</p>
						<!-- Specs List -->
						<ul class="secondary-font text-[10px] text-stone-500 uppercase tracking-wider space-y-2 border-l md:border-l-0 md:border-r border-stone-400 pl-4 md:pl-0 md:pr-4 pt-4">
							{#each watch.specs as spec}
								<li>{spec}</li>
							{/each}
						</ul>
					</div>

					<!-- Image Center -->
					<div
						class="md:col-span-4 order-1 md:order-2 flex justify-center items-center relative py-8 md:py-0">
						<!-- Image Container -->
						<div
							class="relative w-[80vw] h-[80vw] md:w-[28vw] md:h-[35vw] bg-stone-300 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-transform duration-500 hover:scale-[1.02]">
							<img
								src={watch.image}
								alt={watch.name}
								class="w-full h-full object-cover grayscale-[10%] contrast-[1.15]"
							/>
							<!-- Frame Border -->
							<div class="absolute inset-2 border border-white/20 pointer-events-none"></div>
						</div>
					</div>

					<!-- Details Right -->
					<div class="md:col-span-4 order-3 flex flex-col justify-end items-start h-full pb-8 md:pb-0">
						<div class="max-w-xs space-y-8 md:pl-8">
							<p class="secondary-font text-xs leading-relaxed text-stone-800 text-justify">
								{watch.description}
							</p>

							<div class="flex items-center gap-6 pt-6 border-t border-stone-800/20 w-full">
								<span class="footer-font-alt text-2xl md:text-3xl text-stone-800">{watch.price}</span>
								<button
									class="w-12 h-12 rounded-full border border-stone-800 flex items-center justify-center hover:bg-stone-800 hover:text-[#E2D9DC] transition-colors group/btn">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										 stroke-width="1.5"
										 class="group-hover/btn:-rotate-45 transition-transform duration-300">
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
								</button>
							</div>
						</div>
					</div>

				</div>
			</section>
		{/each}

		<!-- FOOTER -->

	</main>

</div>