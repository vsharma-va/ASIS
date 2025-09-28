import { getWatchById } from '$lib/stores/watchData.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const watch = getWatchById(params.watchId);
	// console.log(watch);

	if (!watch) {
		throw error(404, 'Watch not found');
	}

	return {
		watch,
		slug: params.watchId
	};
}
