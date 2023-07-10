import { writable } from 'svelte/store';

export const currentPath = writable('/');
export const config = writable({
    vocabularyUrl: null,
    attributes: null,
    maxDepth: 3,
    basePath: null,
});
export const selectedItems = writable([]);
export const selectedUids = writable([]);
export const showContentBrowser = writable(false);

export const cache = writable({});

//export const levelItems = writable([]);

