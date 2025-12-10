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
// <div className="self-start uppercase secondary-font text-xs sm:text-sm h-6">
// 	<div className="flex items-center justify-end gap-2">
// 		<!-- PREV button -->
// 		<button
// 			className="ml-4 px-3 py-1 rounded-full bg-white/90 text-zinc-800 text-sm font-medium hover:opacity-95 transition"
// 			on:click={goToPrevWatch}
// 			aria-label="Previous watch collection"
// 			type="button"
// 		>
// 			← Prev Collection
// 		</button>
//
// 		<!-- NEXT button -->
// 		<button
// 			className="ml-2 px-3 py-1 rounded-full bg-white/90 text-zinc-800 text-sm font-medium hover:opacity-95 transition"
// 			on:click={goToNextWatch}
// 			aria-label="Next watch collection"
// 			type="button"
// 		>
// 			Next Collection →
// 		</button>
// 	</div>
// </div>