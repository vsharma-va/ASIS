import { writable, derived } from 'svelte/store';

// Track which components are expected to load on current page
const expectedComponents = writable(new Set());

// Track ready state of individual components
const componentStates = writable({});

// Track navigation state to prevent premature loading completion
const isNavigating = writable(false);

// Derived store - only ready when ALL EXPECTED components are ready AND not navigating
export const isLoading = derived(
	[componentStates, expectedComponents, isNavigating],
	([$states, $expected, $navigating]) => {
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
}

// Function to reset all components (useful for page navigation)
export function resetLoading() {
	componentStates.set({});
	expectedComponents.set(new Set());
	isNavigating.set(false);
}

// Signal that navigation is starting
export function startNavigation() {
	isNavigating.set(true);
}

// Signal that navigation has completed and page is ready
export function completeNavigation() {
	isNavigating.set(false);
}

// Export the component states for debugging if needed
export { componentStates, expectedComponents };