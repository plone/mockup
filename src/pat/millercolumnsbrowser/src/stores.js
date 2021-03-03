import { writable } from 'svelte/store';

export const currentPath = writable('/Plone13/');
export const config = writable({
    vocabulary_url: null,
    attr_string: null,
    max_depth: 3,
});

//export const levelItems = writable([]);
