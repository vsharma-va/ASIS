import { writable, derived } from 'svelte/store';

// Track which components are expected to load on current page
const expectedComponents = writable(new Set());

// Track ready state of individual components
const componentStates = writable({});

// Track navigation state to prevent premature loading completion
const isNavigating = writable(false);

// Track when loading started for safety timeout
const loadingStartTime = writable(null);

// Maximum loading time before forcing completion (safety mechanism)
const MAX_LOADING_TIME = 10000; // 10 seconds

// Derived store - only ready when ALL EXPECTED components are ready AND not navigating
export const isLoading = derived(
	[componentStates, expectedComponents, isNavigating, loadingStartTime],
	([$states, $expected, $navigating, $startTime]) => {
		// Safety timeout: Force loading to complete after MAX_LOADING_TIME
		if ($startTime && Date.now() - $startTime > MAX_LOADING_TIME) {
			console.warn('Loading timeout exceeded, forcing completion');
			completeNavigation();
			return false;
		}

		// If we're actively navigating, always show loading
		if ($navigating) return true;

		// If no components are expected, we need to wait a bit
		// This handles the transition period during navigation
		if ($expected.size === 0) return true;

		// Check if all expected components are ready
		for (const component of $expected) {
			if (!$states[component]) {
				return true; // Still loading
			}
		}

		return false; // All expected components are ready
	}
);

// Register a component as expected to load
export function registerComponent(componentName) {
	expectedComponents.update(set => {
		const newSet = new Set(set);
		newSet.add(componentName);
		return newSet;
	});

	// Start timer if this is the first component
	loadingStartTime.update(time => time || Date.now());
}

// Unregister a component (when it's destroyed)
export function unregisterComponent(componentName) {
	expectedComponents.update(set => {
		const newSet = new Set(set);
		newSet.delete(componentName);
		return newSet;
	});
	componentStates.update(states => {
		const newStates = { ...states };
		delete newStates[componentName];
		return newStates;
	});
}

// Function to mark a component as ready
export function setComponentReady(componentName, ready = true) {
	if (ready) {
		// Register component as expected if not already
		registerComponent(componentName);
	}

	componentStates.update(states => ({
		...states,
		[componentName]: ready
	}));

	// Check if all components are ready
	let allReady = true;
	componentStates.subscribe(states => {
		expectedComponents.subscribe(expected => {
			for (const component of expected) {
				if (!states[component]) {
					allReady = false;
				}
			}
		})();
	})();

	// If all ready, reset start time
	if (allReady) {
		loadingStartTime.set(null);
	}
}

// Function to reset all components (useful for page navigation)
export function resetLoading() {
	componentStates.set({});
	expectedComponents.set(new Set());
	isNavigating.set(false);
	loadingStartTime.set(null);
}

// Signal that navigation is starting
export function startNavigation() {
	isNavigating.set(true);
	loadingStartTime.set(Date.now());
}

// Signal that navigation has completed and page is ready
export function completeNavigation() {
	isNavigating.set(false);
	loadingStartTime.set(null);
}

// Debug function to check loading state
export function debugLoadingState() {
	let debug = {};
	componentStates.subscribe(states => debug.states = states)();
	expectedComponents.subscribe(expected => debug.expected = Array.from(expected))();
	isNavigating.subscribe(nav => debug.navigating = nav)();
	isLoading.subscribe(loading => debug.isLoading = loading)();
	console.log('Loading Debug:', debug);
	return debug;
}

// Export the component states for debugging if needed
export { componentStates, expectedComponents };