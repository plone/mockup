import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';

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
export const fieldId = writable("");

export const cache = writable({});

// see https://svelte.dev/repl/ccbc94cb1b4c493a9cf8f117badaeb31?version=4.2.12
// as basis. we enhanced this with get, push ans splice API for reactively
// updateing list values of this dict store
function createMapStore(initial) {
    const store = writable(initial);
    const set = (key, value) => store.update(m => Object.assign({}, m, { [key]: value }));
    const results = derived(store, s => ({
        keys: Object.keys(s),
        values: Object.values(s),
        entries: Object.entries(s),
        set(k, v) {
            store.update(s => Object.assign({}, s, { [k]: v }))
        },
        get(k) {
            return s[k];
        },
        remove(k) {
            store.update(s => {
                delete s[k];
                return s;
            });
        },
        push(k, v) {
            store.update(s => {
                s[k].push(v);
                return s;
            })
        },
        splice(k, idx) {
            store.update(s => {
                s[k].splice(idx, 1);
                return s;
            })
        }
    }));
    return {
        subscribe: results.subscribe,
        set: store.set,
    }
}

// we need a store map with field_id => selectedItems to ensure correct
// selectedItems for multiple pattern occurrences on one page
export const selectedItemsMap = createMapStore({});

// another try with reactive context stores
export function setSelectedItems() {
    let selItems = writable([]);
    setContext('selectedItems', selItems);
}

export function getSelectedItems() {
    return getContext('selectedItems');
}

export function setConfig() {
    let config = writable({});
    setContext('config', config);
}

export function getConfig() {
    return getContext('config');
}

