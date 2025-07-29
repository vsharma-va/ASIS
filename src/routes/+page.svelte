<script>
	import Footer from '$lib/components/footer.svelte';
	import Landing from '$lib/components/Landing.svelte';
	import Partners from '$lib/components/Partners.svelte';
	import Gallery from '$lib/components/Gallery.svelte';

	const petiteImageModules = import.meta.glob('$lib/assets/images/watchFaces/invisible_petite*.{jpg,jpeg,png,webp}', {
		eager: true
	});
	const petiteImageSlides = Object.entries(petiteImageModules).map(([path, module]) => ({
		id: path, // Use the file path as a unique ID
		imageUrl: module.default
	}));

	const doubleRainbowImageModules = import.meta.glob('$lib/assets/images/watchFaces/twin_rainbow*.{jpg,jpeg,png,webp}', {
		eager: true
	});
	const doubleRainbowSlides = Object.entries(doubleRainbowImageModules).map(([path, module]) => ({
		id: path,
		imageUrl: module.default
	}));

	const blackPantherImageModules = import.meta.glob('$lib/assets/images/watchFaces/black_panther*.{jpg,jpeg,png,webp}', {
		eager: true
	});
	const blackPantherSlides = Object.entries(blackPantherImageModules).map(([path, module]) => ({
		id: path,
		imageUrl: module.default
	}));

	let petiteGalleryData = {
		collection: "Petite",
		subCollection: "The Invisible",
		title: "A Gemstone Symphony",
		watchDescription: "A Gemstone Symphony Crafted in the Art of Invisible Setting Watch",
		specs: [
			{ label: "Model NO", value: "M1881S" },
			{ label: "Case Size", value: "33 MM" },
			{ label: "Leather Options", value: "Alligator / Vegan" },
			{ label: "Variants", value: "9 Variants" }
		],
		gemstones: ["Diamond", "Colored Sapphire", "Tsavorite", "Iolite", "Amethyst", "Ruby", "Emerald", "Topaz"],
		slides: petiteImageSlides
	};

	let doubleRainbowGalleryData = {
		collection: "The Twin-Rainbow",
		subCollection: "The Twin-Rainbow",
		title: "A Gemstone Symphony",
		watchDescription: "A Colorful Spectrum Capturing the Rare Essence of a Twin Rainbow Watch",
		specs: [
			{ label: "Model NO", value: "M1308S Rainbow" },
			{ label: "Case Size", value: "38 MM" },
			{ label: "Leather Options", value: "Alligator / Vegan" },
			{ label: "Variants", value: "7 Variants" }
		],
		gemstones: ["Diamond", "Colored Sapphire"],
		slides: doubleRainbowSlides // Dynamically loaded images are assigned here
	}

	let blackPantherGalleryData = {
		collection: "Petite",
		subCollection: "The Black Panther",
		title: "A Gemstone Symphony",
		watchDescription: "A Spirit of the Wild Manifested in a Black Panther Watch",
		specs: [
			{ label: "Model NO", value: "M1308S Black Panther" },
			{ label: "Case Size", value: "38 MM" },
			{ label: "Leather Options", value: "Alligator / Vegan" },
			{ label: "Variants", value: "2 Variants" }
		],
		gemstones: ["Diamond", "Tsavorite"],
		slides: blackPantherSlides // Dynamically loaded images are assigned here
	}

</script>

<!--<Landing />-->
<!--<Partners />-->
<!--<Footer />-->
<Gallery galleryData="{petiteGalleryData}"/>
<Gallery galleryData="{doubleRainbowGalleryData}"/>
<Gallery galleryData="{blackPantherGalleryData}"/>
