import { writable } from 'svelte/store';

export const currentPath = writable('/');
export const config = writable({
    vocabularyUrl: null,
    attributes: null,
    maxDepth: 3,
    basePath: null,
});

//export const levelItems = writable([]);
