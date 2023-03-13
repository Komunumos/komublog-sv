import PocketBase from 'pocketbase';
import { writable } from 'svelte/store'
import config from '../config';

export const pb = new PocketBase(config.apiUrl);
export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange(() => {
    currentUser.set(pb.authStore.model);
});