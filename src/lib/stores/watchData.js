// lib/stores/watchData.js

// Import old images (backward compatibility)
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

// Import new nested structure images
const nestedWatchFaces = import.meta.glob(
	'$lib/assets/images/watchFaces/**/*.{png,jpg,jpeg,webp}',
	{
		eager: true,
		query: '?url',
		import: 'default'
	}
);

// Collection to abbreviation mapping
const COLLECTION_ABBREVIATIONS = {
	'the-invisible-round-petite': 'IP',
	'the-invisible-round-grande': 'IG',
	'the-mosaic': 'MOS',
	'the-single-rainbow': 'SRB',
	'the-twin-rainbow': 'DRB',
	'the-turning-humming-bird': 'HB',
	'the-turning-butterfly': 'BTF',
	'the-black-panther-petite': 'BPP',
	'the-black-panther-grande': 'BPG',
	'the-leopard-petite': 'LP',
	'the-leopard-grande': 'LG',
	'my-light-dancing': 'MLD',
	'invisible-square-petite': 'ISP'
};

/**
 * Get image by filename (old format - backward compatibility)
 */
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
		return null;
	}
}

/**
 * Get images from new nested structure
 * @param {string} watchId - The watch ID (e.g., 'the-invisible-round-petite')
 * @param {string} variantId - The variant ID (e.g., 'diamond', 'sapphire')
 * @returns {string[]} Array of image URLs for the variant
 */
function getVariantImages(watchId, variantId) {
	const abbreviation = COLLECTION_ABBREVIATIONS[watchId];

	if (!abbreviation) {
		console.warn(`No abbreviation found for watch: ${watchId}`);
		return [];
	}

	// Build the path pattern to search for
	const pathPattern = `/src/lib/assets/images/watchFaces/${abbreviation}/${variantId}/edit/`;

	// Find all images matching this path pattern
	const matchingImages = Object.entries(nestedWatchFaces)
		.filter(([path]) => path.includes(pathPattern))
		.map(([, url]) => url)
		.sort(); // Sort to maintain consistent order

	if (matchingImages.length === 0) {
		console.warn(`No images found for ${watchId} - ${variantId} at pattern: ${pathPattern}`);
	}

	return matchingImages;
}

/**
 * Get landing image for a watch
 * Tries new structure first, falls back to old structure
 */
function getLandingImage(watchId, fallbackFilename, specific = false, specificFilename = null) {
	const abbreviation = COLLECTION_ABBREVIATIONS[watchId];

	if (abbreviation) {
		const pathPattern = `/src/lib/assets/images/watchFaces/${abbreviation}/`;

		// 1. SPECIFIC MODE: Look for a specific file within this watch's folder
		if (specific && specificFilename) {
			const specificImage = Object.entries(nestedWatchFaces).find(
				([path]) => path.includes(pathPattern) && path.includes(specificFilename)
			);

			if (specificImage) {
				return specificImage[1];
			}
			console.warn(
				`Specific landing image '${specificFilename}' not found for ${watchId} in new structure.`
			);
		} else {
			const firstImage = Object.entries(nestedWatchFaces).find(([path]) =>
				path.includes(pathPattern)
			);

			if (firstImage) {
				return firstImage[1];
			}
		}
	}

	// Fall back to old structure
	return getImageByID(fallbackFilename);
}

export const watchData = {
	'the-invisible-round-petite': {
		isEnabled: true,
		id: 'the-invisible-round-petite',
		collection: 'The Invisible Round',
		subCollection: 'Petite',
		title: 'A Gemstone Symphony',
		watchDescription: 'A Gemstone Symphony Crafted in the Art of Invisible Setting Round Watch',
		specs: [
			{ label: 'Model NO', value: 'M1881S' },
			{ label: 'Case Size', value: '33 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '9 Variants' }
		],
		gemstones: [
			'Diamond',
			'Colored Sapphire',
			// 'Tsavorite',
			'Iolite',
			'Amethyst',
			'Ruby',
			'Emerald',
			'Topaz'
		],
		landingImage: getLandingImage(
			'the-invisible-round-petite',
			'invisible_petite_1.webp',
			true,
			'SON08352.webp'
		),
		variants: [
			{
				id: 'multi',
				name: 'Diamond',
				color: '#E2E8F0',
				accent: '#F8FAFC',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-multi').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-multi')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'sky-blue',
				name: 'Sky Blue Topaz',
				color: '#00FFF0',
				accent: '#82C8E5',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-sky-blue').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-sky-blue')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'blue',
				name: 'Colored Sapphire',
				color: '#1E40AF',
				accent: '#3B82F6',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-blue').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-blue')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'green',
				name: 'Emerald',
				color: '#065F46',
				accent: '#10B981',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-green').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-green')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'purple',
				name: 'Iolite',
				color: '#71379a',
				accent: '#9264a7',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-purple').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-purple')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'pink',
				name: 'Sapphire',
				color: '#9966CC',
				accent: '#CC66CC',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-pink').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-pink')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'red',
				name: 'Ruby',
				color: '#991B1B',
				accent: '#F87171',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-red').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-red')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'violet',
				name: 'Amethyst',
				color: '#2f184b',
				accent: '#532b88',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-violet').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-violet')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'yellow',
				name: 'Topaz',
				color: '#F59E0B',
				accent: '#FCD34D',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-yellow').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-yellow')
						: [
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
		isEnabled: true,
		id: 'the-invisible-round-grande',
		collection: 'The Invisible Round',
		subCollection: 'Grande',
		title: 'A Gemstone Symphony',
		watchDescription: 'A Gemstone Symphony Crafted in the Art of Invisible Setting Round Watch',
		specs: [
			{ label: 'Model NO', value: 'M1881S' },
			{ label: 'Case Size', value: 'GRANDE / 40 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '9 Variants' }
		],
		gemstones: [
			'Diamond',
			'Colored Sapphire',
			// 'Tsavorite',
			'Iolite',
			'Amethyst',
			'Ruby',
			'Emerald',
			'Topaz'
		],
		landingImage: getLandingImage(
			'the-invisible-round-grande',
			'invisible_petite_1.webp',
			true,
			'SON08402.webp'
		),
		variants: [
			{
				id: 'multi',
				name: 'Diamond',
				color: '#E2E8F0',
				accent: '#F8FAFC',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-multi').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-multi')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'sky-blue',
				name: 'Sky Blue Topaz',
				color: '#00FFF0',
				accent: '#82C8E5',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-sky-blue').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-sky-blue')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'blue',
				name: 'Colored Sapphire',
				color: '#1E40AF',
				accent: '#3B82F6',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-blue').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-blue')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'green',
				name: 'Emerald',
				color: '#065F46',
				accent: '#10B981',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-green').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-green')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'purple',
				name: 'Iolite',
				color: '#71379a',
				accent: '#9264a7',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-purple').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-purple')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'pink',
				name: 'Sapphire',
				color: '#9966CC',
				accent: '#CC66CC',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-pink').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-pink')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'red',
				name: 'Ruby',
				color: '#991B1B',
				accent: '#F87171',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-red').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-red')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'violet',
				name: 'Amethyst',
				color: '#2f184b',
				accent: '#532b88',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-violet').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-violet')
						: [
								getImageByID('invisible_petite_1.webp'),
								getImageByID('invisible_petite_2.webp'),
								getImageByID('invisible_petite_3.webp'),
								getImageByID('invisible_petite_4.webp'),
								getImageByID('invisible_petite_5.webp'),
								getImageByID('invisible_petite_6.webp')
							]
			},
			{
				id: 'yellow',
				name: 'Topaz',
				color: '#F59E0B',
				accent: '#FCD34D',
				images:
					getVariantImages('the-invisible-round-petite', 'IP-yellow').length > 0
						? getVariantImages('the-invisible-round-petite', 'IP-yellow')
						: [
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
		isEnabled: true,
		id: 'the-mosaic',
		collection: 'The Mosaic',
		subCollection: '',
		title: 'A Vivid Arrangement of Colors',
		watchDescription: 'A Vivid Arrangement of Colors in Mosaic Art',
		specs: [
			{ label: 'Model NO', value: 'M1832S' },
			{ label: 'Case Size', value: '49 X 28 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '3 Variants' }
		],
		gemstones: ['Diamonds', 'Sapphires'],
		landingImage: getLandingImage('the-mosaic', 'mosaic_1.webp', true, 'SON08378.webp'),
		variants: [
			{
				id: 'blue',
				name: 'Sapphire',
				color: '#1E40AF',
				accent: '#3B82F6',
				images:
					getVariantImages('the-mosaic', 'mos-blue').length > 0
						? getVariantImages('the-mosaic', 'mos-blue')
						: [
								getImageByID('mosaic_1.webp'),
								getImageByID('mosaic_2.webp'),
								getImageByID('mosaic_3.webp')
							]
			},
			{
				id: 'multi',
				name: 'Diamond',
				color: '#E2E8F0',
				accent: '#F8FAFC',
				images:
					getVariantImages('the-mosaic', 'mos-multi').length > 0
						? getVariantImages('the-mosaic', 'mos-multi')
						: [
								getImageByID('mosaic_1.webp'),
								getImageByID('mosaic_2.webp'),
								getImageByID('mosaic_3.webp')
							]
			},
			{
				id: 'pink',
				name: 'Tsavorite',
				color: '#9966CC',
				accent: '#CC66CC',
				images:
					getVariantImages('the-mosaic', 'mos-pink').length > 0
						? getVariantImages('the-mosaic', 'mos-pink')
						: [
								getImageByID('mosaic_1.webp'),
								getImageByID('mosaic_2.webp'),
								getImageByID('mosaic_3.webp')
							]
			}
		]
	},

	'the-single-rainbow': {
		isEnabled: false,
		id: 'the-single-rainbow',
		collection: 'The Single Rainbow',
		subCollection: '',
		title: 'A Colorful Spectrum',
		watchDescription: 'A Colorful Spectrum Capturing the Rare Essence of a Single Rainbow Watch',
		specs: [
			{ label: 'Model NO', value: 'M1841S Single Ring' },
			{ label: 'Case Size', value: '40 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '7 Variants' }
		],
		gemstones: [
			'Diamond',
			'Colored Sapphires',
			// 'Tsavorite',
			'Iolite',
			'Amethyst',
			'Ruby',
			'Emerald',
			'Topaz'
		],
		landingImage: getLandingImage('the-single-rainbow', 'single_rainbow_1.webp', true, 'SONO08398.webp'),
		variants: [
			{
				id: 'multi',
				name: 'Single Rainbow',
				color: '#EF4444',
				accent: '#FCA5A5',
				images:
					getVariantImages('the-single-rainbow', 'multi').length > 0
						? getVariantImages('the-single-rainbow', 'multi')
						: [getImageByID('single_rainbow_1.webp'), getImageByID('single_rainbow_2.webp')]
			}
		]
	},

	'the-twin-rainbow': {
		isEnabled: true,
		id: 'the-twin-rainbow',
		collection: 'The Twin-Rainbow',
		subCollection: '',
		title: 'A Colorful Spectrum',
		watchDescription: 'A Colorful Spectrum Capturing the Rare Essence of a Twin Rainbow Watch',
		specs: [
			{ label: 'Model NO', value: 'M1308S Rainbow' },
			{ label: 'Case Size', value: '38 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '1 Variant' }
		],
		gemstones: ['Diamonds', 'Colored Sapphires'],
		landingImage: getLandingImage('the-twin-rainbow', 'twin_rainbow_1.webp', true, 'SON08398.webp'),
		variants: [
			{
				id: 'white',
				name: 'Double Rainbow',
				color: '#E2E8F0',
				accent: '#F8FAFC',
				images:
					getVariantImages('the-twin-rainbow', 'DRB-white').length > 0
						? getVariantImages('the-twin-rainbow', 'DRB-white')
						: [
								getImageByID('twin_rainbow_1.webp'),
								getImageByID('twin_rainbow_1.webp'),
								getImageByID('twin_rainbow_1.webp'),
								getImageByID('twin_rainbow_1.webp'),
								getImageByID('twin_rainbow_1.webp')
							]
			}
		]
	},

	'the-turning-humming-bird': {
		isEnabled: true,
		id: 'the-turning-humming-bird',
		collection: 'The Turning Humming Bird',
		subCollection: '',
		title: 'The Turning Humming Bird',
		watchDescription: 'A natural motion, with a Kingfisher Revolving in the Watch\t',
		specs: [
			{ label: 'Model NO', value: 'M1841S Bird' },
			{ label: 'Case Size', value: '40 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '3 Variants' }
		],
		gemstones: [
			'Diamond',
			'Colored Sapphires',
			// 'Tsavorite',
			'Iolite',
			'Amethyst',
			'Ruby',
			'Emerald',
			'Topaz'
		],
		landingImage: getLandingImage(
			'the-turning-humming-bird',
			'humming_bird_1.webp',
			true,
			'SON08405.webp'
		),
		variants: [
			{
				id: 'white',
				name: 'Diamond',
				color: '#E2E8F0',
				accent: '#F8FAFC',
				images:
					getVariantImages('the-turning-humming-bird', 'HB-white').length > 0
						? getVariantImages('the-turning-humming-bird', 'HB-white')
						: [getImageByID('humming_bird_1.webp'), getImageByID('humming_bird_2.webp')]
			},
			{
				id: 'blue',
				name: 'Sapphire',
				color: '#00FFF0',
				accent: '#82C8E5',
				images:
					getVariantImages('the-turning-humming-bird', 'HB-blue').length > 0
						? getVariantImages('the-turning-humming-bird', 'HB-blue')
						: [getImageByID('humming_bird_1.webp'), getImageByID('humming_bird_2.webp')]
			},
			{
				id: 'pink',
				name: 'Iolite',
				color: '#9966CC',
				accent: '#CC66CC',
				images:
					getVariantImages('the-turning-humming-bird', 'HB-pink').length > 0
						? getVariantImages('the-turning-humming-bird', 'HB-pink')
						: [getImageByID('humming_bird_1.webp'), getImageByID('humming_bird_2.webp')]
			}
		]
	},

	'the-turning-butterfly': {
		isEnabled: false,
		id: 'the-turning-butterfly',
		collection: 'The Turning Butterfly',
		subCollection: '',
		title: 'A natural motion',
		watchDescription: 'A Natural Motion with an Butterfly Revolving in the Watch',
		specs: [
			{ label: 'Model NO', value: 'M1841S Bird' },
			{ label: 'Case Size', value: '40 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '7 Variants' }
		],
		gemstones: [
			'Diamond',
			'Colored Sapphires',
			// 'Tsavorite',
			'Iolite',
			'Amethyst',
			'Ruby',
			'Emerald',
			'Topaz'
		],
		landingImage: getLandingImage('the-turning-butterfly', 'humming_bird_1.webp'),
		variants: [
			{
				id: 'multi',
				name: 'Humming Bird',
				color: '#059669',
				accent: '#6EE7B7',
				images:
					getVariantImages('the-turning-butterfly', 'multi').length > 0
						? getVariantImages('the-turning-butterfly', 'multi')
						: [getImageByID('humming_bird_1.webp'), getImageByID('humming_bird_2.webp')]
			}
		]
	},

	'the-black-panther-petite': {
		isEnabled: false,
		id: 'the-black-panther-petite',
		collection: 'The Black Panther',
		subCollection: 'Petite',
		title: 'A Spirit of the Wild',
		watchDescription: 'A Spirit of the Wild Manifested in a Black Panther Watch',
		specs: [
			{ label: 'Model NO', value: 'M1308S Black Panther' },
			{ label: 'Case Size', value: '38 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '2 Variants' }
		],
		gemstones: ['Diamonds', 'Tsavorite'],
		landingImage: getLandingImage('the-black-panther-petite', 'black_panther_petite_1.webp'),
		variants: [
			{
				id: 'black',
				name: 'Black Panther Petite',
				color: '#1F2937',
				accent: '#4B5563',
				images:
					getVariantImages('the-black-panther-petite', 'black').length > 0
						? getVariantImages('the-black-panther-petite', 'black')
						: [
								getImageByID('black_panther_petite_1.webp'),
								getImageByID('black_panther_petite_2.webp')
							]
			}
		]
	},

	'the-black-panther-grande': {
		isEnabled: true,
		id: 'the-black-panther-grande',
		collection: 'The Black Panther',
		subCollection: 'Grande',
		title: 'A Spirit of the Wild',
		watchDescription: 'A Spirit of the Wild Manifested in a Black Panther Watch',
		specs: [
			{ label: 'Model NO', value: 'M1219S Black Panther' },
			{ label: 'Case Size', value: '44 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '1 Variant' }
		],
		gemstones: ['Diamonds', 'Tsavorite'],
		landingImage: getLandingImage(
			'the-black-panther-grande',
			'black_panther_1.webp',
			true,
			'SON08399-f.webp'
		),
		variants: [
			{
				id: 'black',
				name: 'Diamonds and Tsavorite',
				color: '#111827',
				accent: '#374151',
				images:
					getVariantImages('the-black-panther-grande', 'BP-black').length > 0
						? getVariantImages('the-black-panther-grande', 'BP-black')
						: [getImageByID('black_panther_1.webp'), getImageByID('black_panther_1.webp')]
			}
		]
	},

	'the-leopard-petite': {
		isEnabled: false,
		id: 'the-leopard-petite',
		collection: 'The Leopard',
		subCollection: 'Petite',
		title: 'A Spirit of the Wild',
		watchDescription: 'A Spirit of the Wild Manifested in a Leopard Watch',
		specs: [
			{ label: 'Model NO', value: 'M1308S Leopard' },
			{ label: 'Case Size', value: '38 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '2 Variants' }
		],
		gemstones: ['Diamonds', 'Tsavorite'],
		landingImage: getLandingImage('the-leopard-petite', 'leopard_petite_1.webp'),
		variants: [
			{
				id: 'gold',
				name: 'Leopard Petite',
				color: '#D97706',
				accent: '#FBBF24',
				images:
					getVariantImages('the-leopard-petite', 'gold').length > 0
						? getVariantImages('the-leopard-petite', 'gold')
						: [getImageByID('leopard_petite_1.webp'), getImageByID('leopard_petite_2.webp')]
			}
		]
	},

	'the-leopard-grande': {
		isEnabled: true,
		isPremium: true,
		id: 'the-leopard-grande',
		collection: 'The Leopard',
		subCollection: 'Grande',
		title: 'A Spirit of the Wild',
		watchDescription: 'A Spirit of the Wild Manifested in a Leopard Watch',
		specs: [
			{ label: 'Model NO', value: 'M1219S Leopard' },
			{ label: 'Case Size', value: '44 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '2 Variants' }
		],
		gemstones: ['Diamonds', 'Tsavorite'],
		landingImage: getLandingImage(
			'the-leopard-grande',
			'leopard_grande_1.webp',
			true,
			'SON08404.webp'
		),
		variants: [
			{
				id: 'black',
				name: 'Black',
				color: '#111827',
				accent: '#374151',
				images:
					getVariantImages('the-leopard-grande', 'LG-black').length > 0
						? getVariantImages('the-leopard-grande', 'LG-black')
						: [getImageByID('leopard_grande_1.webp'), getImageByID('leopard_grande_2.webp')]
			},
			{
				id: 'white',
				name: 'white',
				color: '#E2E8F0',
				accent: '#F8FAFC',
				images:
					getVariantImages('the-leopard-grande', 'LG-white').length > 0
						? getVariantImages('the-leopard-grande', 'LG-white')
						: [getImageByID('leopard_grande_1.webp'), getImageByID('leopard_grande_2.webp')]
			}
		]
	},

	'my-light-dancing': {
		isEnabled: true,
		id: 'my-light-dancing',
		collection: 'My Light Dancing',
		subCollection: '',
		title: 'A choreography of union',
		watchDescription: 'A choreography of union in a watch',
		specs: [
			{ label: 'Model NO', value: 'M1890 S' },
			{ label: 'Case Size', value: '38 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '2 Variants' }
		],
		gemstones: ['Diamonds', 'sapphires', 'Tsavorite'],
		landingImage: getLandingImage(
			'my-light-dancing',
			'my_light_dancing_1.webp',
			true,
			'SON08377.webp'
		),
		variants: [
			{
				id: 'blue',
				name: 'Sapphire',
				color: '#1E40AF',
				accent: '#3B82F6',
				images:
					getVariantImages('my-light-dancing', 'MLD-blue').length > 0
						? getVariantImages('my-light-dancing', 'MLD-blue')
						: [getImageByID('my_light_dancing_1.webp'), getImageByID('my_light_dancing_2.webp')]
			},
			{
				id: 'pink',
				name: 'Diamond',
				color: '#BE185D',
				accent: '#F472B6',
				images:
					getVariantImages('my-light-dancing', 'MLD-pink').length > 0
						? getVariantImages('my-light-dancing', 'MLD-pink')
						: [getImageByID('my_light_dancing_1.webp'), getImageByID('my_light_dancing_2.webp')]
			}
		]
	},

	'invisible-square-petite': {
		isEnabled: false,
		id: 'invisible-square-petite',
		collection: 'Invisible Square',
		subCollection: 'Petite',
		title: 'A Gemstone Symphony',
		watchDescription: 'A Gemstone Symphony Crafted in the Art of Invisible Setting Square Watch',
		specs: [
			{ label: 'Model NO', value: 'M1886S' },
			{ label: 'Case Size', value: '32 MM X 32 MM' },
			{ label: 'Leather Options', value: 'Alligator / Vegan' },
			{ label: 'Variants', value: '11 Variants' }
		],
		gemstones: [
			'Diamond',
			'Colored Sapphire',
			// 'Tsavorite',
			'Iolite',
			'Amethyst',
			'Ruby',
			'Emerald',
			'Topaz'
		],
		landingImage: getLandingImage('invisible-square-petite', 'invisible_square_petite_1.webp'),
		variants: [
			{
				id: 'diamond',
				name: 'Diamond',
				color: '#E2E8F0',
				accent: '#F8FAFC',
				images:
					getVariantImages('invisible-square-petite', 'diamond').length > 0
						? getVariantImages('invisible-square-petite', 'diamond')
						: [
								getImageByID('invisible_square_petite_1.webp'),
								getImageByID('invisible_square_petite_2.webp')
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

// Helper to get available variant folders for a watch (useful for debugging)
export function getAvailableVariants(watchId) {
	const abbreviation = COLLECTION_ABBREVIATIONS[watchId];
	if (!abbreviation) return [];

	const pathPattern = `/src/lib/assets/images/watchFaces/${abbreviation}/`;
	const variantPaths = Object.keys(nestedWatchFaces)
		.filter((path) => path.includes(pathPattern))
		.map((path) => {
			const match = path.match(new RegExp(`${abbreviation}-(\\w+)/edit/`));
			return match ? match[1] : null;
		})
		.filter((v, i, arr) => v && arr.indexOf(v) === i); // unique values only

	return variantPaths;
}
