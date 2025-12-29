const watchData = {
	// All data that is COMMON to every variant goes here.
	base: {

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
	},
	// All data that is UNIQUE to each variant goes here.
	variations: [
		{
			id: 'catawba',
			colorName: 'Catawba',
			colorValue: '#6f3540',
			slides: [
				{ imageUrl: '$lib/assets/images/invisible_petite-01.jpg' },
			]
		},
		{
			id: 'amazon',
			colorName: 'Amazon',
			colorValue: '#3b7d57',
			slides: [
				{ imageUrl: '$lib/assets/images/invisible_petite-02.jpg' }
			]
		},
		{
			id: 'peru',
			colorName: 'Peru',
			colorValue: '#c48f37',
			slides: [
				{ imageUrl: '$lib/assets/images/invisible_petite-03.jpg' }
			]
		},
		{
			id: 'charleston-green',
			colorName: 'Charleston Green',
			colorValue: '#232b32',
			slides: [
				{ imageUrl: '$lib/assets/images/invisible_petite-04.jpg' }
			]
		},
		{
			id: 'charleston-green',
			colorName: 'Charleston Green',
			colorValue: '#232b32',
			slides: [
				{ imageUrl: '$lib/assets/images/invisible_petite-05.jpg' }
			]
		}
	]
};

export default watchData;