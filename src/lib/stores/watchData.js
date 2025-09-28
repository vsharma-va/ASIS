// lib/stores/watchData.js
const generalImages = import.meta.glob('$lib/assets/images/*.{png,jpg,jpeg,webp}', {
	eager: true,
	query: '?url',
	import: 'default'
});
const watchFaces = import.meta.glob('$lib/assets/images/watchFaces/*.{png,jpg,jpeg,webp}', {
	eager: true,
	query: '?url',
	import: 'default'
});

function getImageByID(filename) {
	const generalPath = `/src/lib/assets/images/${filename}`;
	const watchFacePath = `/src/lib/assets/images/watchFaces/${filename}`;

	if (generalImages[generalPath]) {
		console.log('Found in general images:', filename);
		return generalImages[generalPath];
	} else if (watchFaces[watchFacePath]) {
		console.log('Found in watchFaces:', filename);
		return watchFaces[watchFacePath];
	} else {
		console.error('Image not found:', filename);
		console.log('Available general images:', Object.keys(generalImages));
		console.log('Available watch faces:', Object.keys(watchFaces));
		return null;
	}
}

export const watchData = {
	'the-invisible-round-petite': {
		id: 'the-invisible-round-petite',
		collection: 'The Invisible Round',
		subCollection: 'Petite',
		title: 'A Gemstone Symphony',
		watchDescription:
			'Crafted in the art of invisible setting, this timepiece is a testament to meticulous design and horological excellence.',
		specs: [
			{ label: 'Model NO', value: 'M1881S' },
			{ label: 'Case Size', value: '33 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '10 Variants' }
		],
		gemstones: [
			'Diamond',
			'Colored Sapphire',
			'Tsavorite',
			'Iolite',
			'Amethyst',
			'Ruby',
			'Emerald',
			'Topaz'
		],
		landingImage: getImageByID('LandingBG.webp'),
		variants: [
			{
				id: 'diamond',
				name: 'Diamond',
				color: '#E2E8F0',
				accent: '#F8FAFC',
				images: [
					getImageByID('invisible_petite_1.webp'),
					getImageByID('invisible_petite_2.webp'),
					getImageByID('invisible_petite_3.webp'),
					getImageByID('invisible_petite_4.webp'),
					getImageByID('invisible_petite_5.webp'),
					getImageByID('invisible_petite_6.webp')
				]
			},
			{
				id: 'sapphire',
				name: 'Colored Sapphire',
				color: '#1E40AF',
				accent: '#3B82F6',
				images: [
					getImageByID('invisible_petite_1.webp'),
					getImageByID('invisible_petite_2.webp'),
					getImageByID('invisible_petite_3.webp'),
					getImageByID('invisible_petite_4.webp'),
					getImageByID('invisible_petite_5.webp'),
					getImageByID('invisible_petite_6.webp')
				]
			},
			{
				id: 'tsavorite',
				name: 'Tsavorite',
				color: '#065F46',
				accent: '#10B981',
				images: [
					getImageByID('invisible_petite_1.webp'),
					getImageByID('invisible_petite_2.webp'),
					getImageByID('invisible_petite_3.webp'),
					getImageByID('invisible_petite_4.webp'),
					getImageByID('invisible_petite_5.webp'),
					getImageByID('invisible_petite_6.webp')
				]
			},
			{
				id: 'ruby',
				name: 'Ruby',
				color: '#991B1B',
				accent: '#F87171',
				images: [
					getImageByID('invisible_petite_1.webp'),
					getImageByID('invisible_petite_2.webp'),
					getImageByID('invisible_petite_3.webp'),
					getImageByID('invisible_petite_4.webp'),
					getImageByID('invisible_petite_5.webp'),
					getImageByID('invisible_petite_6.webp')
				]
			}
		]
	},

	'the-invisible-round-grande': {
		id: 'the-invisible-round-grande',
		collection: 'The Invisible Round',
		subCollection: 'Grande',
		title: 'A Gemstone Symphony',
		watchDescription:
			'Crafted in the art of invisible setting, this larger timepiece showcases exceptional horological mastery and artistic vision.',
		specs: [
			{ label: 'Model NO', value: 'M1835S' },
			{ label: 'Case Size', value: '40 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '10 Variants' }
		],
		gemstones: [
			'Diamond',
			'Colored Sapphire',
			'Tsavorite',
			'Iolite',
			'Amethyst',
			'Ruby',
			'Emerald',
			'Topaz'
		],
		variants: [
			{
				id: 'diamond',
				name: 'Diamond',
				color: '#E2E8F0',
				accent: '#F8FAFC',
				images: [
					getImageByID('invisible_petite_1.webp'),
					getImageByID('invisible_petite_2.webp'),
					getImageByID('invisible_petite_3.webp'),
					getImageByID('invisible_petite_4.webp'),
					getImageByID('invisible_petite_5.webp'),
					getImageByID('invisible_petite_6.webp')
				]
			},
			{
				id: 'sapphire',
				name: 'Colored Sapphire',
				color: '#1E40AF',
				accent: '#3B82F6',
				images: [
					getImageByID('invisible_petite_1.webp'),
					getImageByID('invisible_petite_2.webp'),
					getImageByID('invisible_petite_3.webp'),
					getImageByID('invisible_petite_4.webp'),
					getImageByID('invisible_petite_5.webp'),
					getImageByID('invisible_petite_6.webp')
				]
			},
			{
				id: 'emerald',
				name: 'Emerald',
				color: '#065F46',
				accent: '#10B981',
				images: [
					getImageByID('invisible_petite_1.webp'),
					getImageByID('invisible_petite_2.webp'),
					getImageByID('invisible_petite_3.webp'),
					getImageByID('invisible_petite_4.webp'),
					getImageByID('invisible_petite_5.webp'),
					getImageByID('invisible_petite_6.webp')
				]
			},
			{
				id: 'topaz',
				name: 'Topaz',
				color: '#F59E0B',
				accent: '#FCD34D',
				images: [
					getImageByID('invisible_petite_1.webp'),
					getImageByID('invisible_petite_2.webp'),
					getImageByID('invisible_petite_3.webp'),
					getImageByID('invisible_petite_4.webp'),
					getImageByID('invisible_petite_5.webp'),
					getImageByID('invisible_petite_6.webp')
				]
			}
		]
	},

	'the-mosaic': {
		id: 'the-mosaic',
		collection: 'The Mosaic Collection',
		subCollection: 'Artistic Series',
		title: 'A Vivid Arrangement of Colors',
		watchDescription:
			'A stunning mosaic art piece that captures the essence of color harmony in a sophisticated rectangular timepiece.',
		specs: [
			{ label: 'Model NO', value: 'M1832S' },
			{ label: 'Case Size', value: '49 X 28 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '3 Variants' }
		],
		gemstones: ['Diamonds', 'Sapphires', 'Tsavorite'],
		variants: [
			{
				id: 'classic',
				name: 'Classic Mosaic',
				color: '#6B46C1',
				accent: '#A78BFA',
				images: [
					'https://assets.codepen.io/16327/portrait-number-03.png',
					'https://assets.codepen.io/16327/portrait-number-04.png',
					'https://assets.codepen.io/16327/portrait-number-05.png',
					'https://assets.codepen.io/16327/portrait-number-06.png'
				]
			},
			{
				id: 'rainbow',
				name: 'Rainbow Mosaic',
				color: '#EC4899',
				accent: '#F472B6',
				images: [
					'https://assets.codepen.io/16327/portrait-number-04.png',
					'https://assets.codepen.io/16327/portrait-number-05.png',
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-03.png'
				]
			},
			{
				id: 'earth-tones',
				name: 'Earth Tones',
				color: '#92400E',
				accent: '#D97706',
				images: [
					'https://assets.codepen.io/16327/portrait-number-05.png',
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-03.png',
					'https://assets.codepen.io/16327/portrait-number-04.png'
				]
			}
		]
	},

	'the-single-rainbow': {
		id: 'the-single-rainbow',
		collection: 'Rainbow Collection',
		subCollection: 'Single Ring',
		title: 'Spectrum of Excellence',
		watchDescription:
			'A colorful spectrum capturing the rare essence of a single rainbow watch, representing hope and beauty in timepiece form.',
		specs: [
			{ label: 'Model NO', value: 'M1841S Single Ring' },
			{ label: 'Case Size', value: '40 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '1 Variant' }
		],
		gemstones: [
			'Diamond',
			'Colored Sapphires',
			'Tsavorite',
			'Iolite',
			'Amethyst',
			'Ruby',
			'Emerald',
			'Topaz'
		],
		variants: [
			{
				id: 'single-rainbow',
				name: 'Single Rainbow',
				color: '#EF4444',
				accent: '#FCA5A5',
				images: [
					'https://assets.codepen.io/16327/portrait-number-04.png',
					'https://assets.codepen.io/16327/portrait-number-05.png',
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-07.png'
				]
			}
		]
	},

	'the-twin-rainbow': {
		id: 'the-twin-rainbow',
		collection: 'Rainbow Collection',
		subCollection: 'Twin Ring',
		title: 'Double Spectrum Majesty',
		watchDescription:
			'A rare and captivating twin rainbow design that showcases the extraordinary beauty of dual color spectrums in perfect harmony.',
		specs: [
			{ label: 'Model NO', value: 'M1308S Rainbow' },
			{ label: 'Case Size', value: '38 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '7 Variants' }
		],
		gemstones: ['Diamonds', 'Colored Sapphires'],
		variants: [
			{
				id: 'primary-spectrum',
				name: 'Primary Spectrum',
				color: '#DC2626',
				accent: '#FCA5A5',
				images: [
					'https://assets.codepen.io/16327/portrait-number-05.png',
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-07.png',
					'https://assets.codepen.io/16327/portrait-number-04.png'
				]
			},
			{
				id: 'cool-spectrum',
				name: 'Cool Spectrum',
				color: '#2563EB',
				accent: '#93C5FD',
				images: [
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-07.png',
					'https://assets.codepen.io/16327/portrait-number-04.png',
					'https://assets.codepen.io/16327/portrait-number-05.png'
				]
			},
			{
				id: 'warm-spectrum',
				name: 'Warm Spectrum',
				color: '#EA580C',
				accent: '#FB923C',
				images: [
					'https://assets.codepen.io/16327/portrait-number-07.png',
					'https://assets.codepen.io/16327/portrait-number-04.png',
					'https://assets.codepen.io/16327/portrait-number-05.png',
					'https://assets.codepen.io/16327/portrait-number-06.png'
				]
			}
		]
	},

	'the-turning-butterfly': {
		id: 'the-turning-butterfly',
		collection: 'Nature Collection',
		subCollection: 'Kinetic Series',
		title: 'Natural Motion Artistry',
		watchDescription:
			'A mesmerizing timepiece featuring a butterfly that revolves naturally within the watch, symbolizing transformation and grace.',
		specs: [
			{ label: 'Model NO', value: 'Excluding USA' },
			{ label: 'Case Size', value: '42 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '7 Variants' }
		],
		gemstones: ['Natural Diamonds', 'Colored Gems', 'Precious Stones'],
		variants: [
			{
				id: 'monarch',
				name: 'Monarch',
				color: '#F97316',
				accent: '#FED7AA',
				images: [
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-07.png',
					'https://assets.codepen.io/16327/portrait-number-01.png',
					'https://assets.codepen.io/16327/portrait-number-02.png'
				]
			},
			{
				id: 'blue-morpho',
				name: 'Blue Morpho',
				color: '#1D4ED8',
				accent: '#93C5FD',
				images: [
					'https://assets.codepen.io/16327/portrait-number-07.png',
					'https://assets.codepen.io/16327/portrait-number-01.png',
					'https://assets.codepen.io/16327/portrait-number-02.png',
					'https://assets.codepen.io/16327/portrait-number-06.png'
				]
			},
			{
				id: 'emerald-swallowtail',
				name: 'Emerald Swallowtail',
				color: '#059669',
				accent: '#6EE7B7',
				images: [
					'https://assets.codepen.io/16327/portrait-number-01.png',
					'https://assets.codepen.io/16327/portrait-number-02.png',
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-07.png'
				]
			}
		]
	},

	// Add placeholders for the remaining watches with proper structure
	'luxury-classic-gold': {
		id: 'luxury-classic-gold',
		collection: 'Classic Collection',
		subCollection: 'Gold Series',
		title: 'Timeless Elegance',
		watchDescription:
			'A classic timepiece that embodies traditional luxury watchmaking with contemporary refinement.',
		specs: [
			{ label: 'Model NO', value: 'LC001G' },
			{ label: 'Case Size', value: '40 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '4 Variants' }
		],
		gemstones: ['Diamond', 'Gold', 'Mother of Pearl'],
		variants: [
			{
				id: 'rose-gold',
				name: 'Rose Gold',
				color: '#E91E63',
				accent: '#F8BBD9',
				images: [
					'https://assets.codepen.io/16327/portrait-number-07.png',
					'https://assets.codepen.io/16327/portrait-number-01.png',
					'https://assets.codepen.io/16327/portrait-number-02.png',
					'https://assets.codepen.io/16327/portrait-number-03.png'
				]
			},
			{
				id: 'white-gold',
				name: 'White Gold',
				color: '#F5F5F5',
				accent: '#FFFFFF',
				images: [
					'https://assets.codepen.io/16327/portrait-number-01.png',
					'https://assets.codepen.io/16327/portrait-number-02.png',
					'https://assets.codepen.io/16327/portrait-number-03.png',
					'https://assets.codepen.io/16327/portrait-number-07.png'
				]
			}
		]
	},

	'sport-titanium': {
		id: 'sport-titanium',
		collection: 'Sport Collection',
		subCollection: 'Titanium Series',
		title: 'Athletic Precision',
		watchDescription:
			'A robust sports timepiece designed for active lifestyles, combining durability with sophisticated aesthetics.',
		specs: [
			{ label: 'Model NO', value: 'ST002T' },
			{ label: 'Case Size', value: '44 MM' },
			{ label: 'Leather Options', value: 'Rubber / Titanium Bracelet' },
			{ label: 'Variants', value: '3 Variants' }
		],
		gemstones: ['Titanium', 'Ceramic', 'Carbon Fiber'],
		variants: [
			{
				id: 'black-titanium',
				name: 'Black Titanium',
				color: '#1F2937',
				accent: '#4B5563',
				images: [
					'https://assets.codepen.io/16327/portrait-number-02.png',
					'https://assets.codepen.io/16327/portrait-number-03.png',
					'https://assets.codepen.io/16327/portrait-number-04.png',
					'https://assets.codepen.io/16327/portrait-number-01.png'
				]
			},
			{
				id: 'blue-titanium',
				name: 'Blue Titanium',
				color: '#1E3A8A',
				accent: '#60A5FA',
				images: [
					'https://assets.codepen.io/16327/portrait-number-03.png',
					'https://assets.codepen.io/16327/portrait-number-04.png',
					'https://assets.codepen.io/16327/portrait-number-01.png',
					'https://assets.codepen.io/16327/portrait-number-02.png'
				]
			}
		]
	},

	'vintage-heritage': {
		id: 'vintage-heritage',
		collection: 'Heritage Collection',
		subCollection: 'Vintage Series',
		title: 'Historical Reverence',
		watchDescription:
			'A tribute to vintage watchmaking traditions, featuring classic design elements with modern precision.',
		specs: [
			{ label: 'Model NO', value: 'VH003H' },
			{ label: 'Case Size', value: '38 MM' },
			{ label: 'Leather Options', value: 'Vintage Leather / Alligator' },
			{ label: 'Variants', value: '5 Variants' }
		],
		gemstones: ['Bronze', 'Silver', 'Vintage Patina'],
		variants: [
			{
				id: 'bronze',
				name: 'Bronze',
				color: '#CD7F32',
				accent: '#DEB887',
				images: [
					'https://assets.codepen.io/16327/portrait-number-04.png',
					'https://assets.codepen.io/16327/portrait-number-05.png',
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-03.png'
				]
			},
			{
				id: 'silver',
				name: 'Silver',
				color: '#C0C0C0',
				accent: '#E5E5E5',
				images: [
					'https://assets.codepen.io/16327/portrait-number-05.png',
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-03.png',
					'https://assets.codepen.io/16327/portrait-number-04.png'
				]
			}
		]
	},

	'limited-edition-platinum': {
		id: 'limited-edition-platinum',
		collection: 'Limited Edition',
		subCollection: 'Platinum Series',
		title: 'Exclusive Masterpiece',
		watchDescription:
			'An extremely rare and exclusive timepiece crafted from the finest platinum, representing the pinnacle of luxury.',
		specs: [
			{ label: 'Model NO', value: 'LE004P' },
			{ label: 'Case Size', value: '42 MM' },
			{ label: 'Leather Options', value: 'Platinum Bracelet / Crocodile' },
			{ label: 'Variants', value: '2 Variants' }
		],
		gemstones: ['Platinum', 'Rare Diamonds', 'Precious Stones'],
		variants: [
			{
				id: 'platinum-diamond',
				name: 'Platinum Diamond',
				color: '#E5E4E2',
				accent: '#FFFFFF',
				images: [
					'https://assets.codepen.io/16327/portrait-number-06.png',
					'https://assets.codepen.io/16327/portrait-number-07.png',
					'https://assets.codepen.io/16327/portrait-number-01.png',
					'https://assets.codepen.io/16327/portrait-number-05.png'
				]
			},
			{
				id: 'platinum-black',
				name: 'Platinum Black',
				color: '#2C2C2C',
				accent: '#808080',
				images: [
					'https://assets.codepen.io/16327/portrait-number-07.png',
					'https://assets.codepen.io/16327/portrait-number-01.png',
					'https://assets.codepen.io/16327/portrait-number-05.png',
					'https://assets.codepen.io/16327/portrait-number-06.png'
				]
			}
		]
	}
};

// Helper function to get watch by ID
export function getWatchById(id) {
	return watchData[id] || null;
}

// Helper function to get all watch IDs (for navigation)
export function getAllWatchIds() {
	return Object.keys(watchData);
}

// Helper function to get all watches
export function getAllWatches() {
	return Object.values(watchData);
}
