import { setContext } from 'svelte';
import { writable } from 'svelte/store';

export const gridView = writable(false);

export function setCurrentPath() {
    let currentPath = writable('');
    setContext('currentPath', currentPath);
}

export function setPathCache() {
    let pathCache = writable({});
    setContext('pathCache', pathCache);
}

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
