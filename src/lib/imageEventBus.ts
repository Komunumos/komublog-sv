// src/lib/event-bus.js
import { writable } from 'svelte/store';

interface ImageEventPayload {
	event: string;
	image: string | null;
}
const { subscribe, update } = writable<ImageEventPayload>({ event: '', image: null });

export const ImageEventBus = {
	subscribe,
	emit(event: string, image: string) {
		update(() => ({ event, image }));
	}
};
