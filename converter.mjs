// convert-images.mjs
import sharp from 'sharp';
import { glob } from 'glob';
import { unlink } from 'fs/promises';
import path from 'path';

// --- Configuration ---
const SOURCE_GLOB = './src/lib/assets/images/watchFaces/**/*.{jpg,png,jpeg}';
const WEBP_QUALITY = 75; // (0-100) Great balance of size and quality.
const WEBP_EFFORT = 6; // (0-6) 6 is "maximum compression" (slowest, smallest file)
const DELETE_ORIGINALS = true; // <-- !! IMPORTANT: Set to true ONLY when you are sure !!
// --- End Configuration ---

async function convertImages() {
	console.log('Finding images...');
	const files = await glob(SOURCE_GLOB);

	if (files.length === 0) {
		console.log('No images found to convert.');
		return;
	}

	console.log(`Found ${files.length} images. Starting conversion...`);

	const conversionPromises = files.map(async (file) => {
		const newPath = path.join(
			path.dirname(file),
			path.basename(file, path.extname(file)) + '.webp'
		);

		try {
			await sharp(file)
				.webp({
					quality: WEBP_QUALITY,
					effort: WEBP_EFFORT,
				})
				.toFile(newPath);

			console.log(`Converted: ${file} -> ${newPath}`);

			if (DELETE_ORIGINALS) {
				await unlink(file);
				console.log(`Deleted original: ${file}`);
			}
		} catch (err) {
			console.error(`Failed to convert ${file}:`, err);
		}
	});

	await Promise.all(conversionPromises);
	console.log('---');
	console.log('All conversions complete!');
}

convertImages();