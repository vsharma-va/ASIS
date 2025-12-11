import { writable } from 'svelte/store';

export const contactFormVisible = writable(false);

export function openContactForm() {
	contactFormVisible.set(true);
}

export function closeContactForm() {
	contactFormVisible.set(false);
}
