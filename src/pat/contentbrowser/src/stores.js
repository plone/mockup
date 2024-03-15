import { setContext } from 'svelte';
import { writable } from 'svelte/store';

export const currentPath = writable('/');
export const gridView = writable(false);
export const pathCache = writable({});

// reactive context stores
export function setSelectedItems() {
    let selItems = writable([]);
    setContext('selectedItems', selItems);
}

export function setConfig() {
    let config = writable({});
    setContext('config', config);
}

export function setShowContentBrowser() {
    let showContentBrowser = writable(false);
    setContext('showContentBrowser', showContentBrowser);
}

export function setSelectedUids() {
    let selUids = writable([]);
    setContext("selectedUids", selUids);
}
