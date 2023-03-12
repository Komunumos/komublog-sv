import { writable } from "svelte/store";
import type { Babble } from "../types/babble";

export const babbleStore = writable<Babble[]>([]);