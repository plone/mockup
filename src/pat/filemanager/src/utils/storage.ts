import Cookies, { type CookieAttributes } from "js-cookie";

// Cookie-backed key/value store mirroring the patternslib `store.local`
// interface (get/set/remove). Values are JSON-serialized under a
// `${prefix}:${name}` cookie so user preferences (batch size, visible columns)
// survive reloads and travel with the request to the server, matching the
// cookie-based settings the legacy pat-structure used.

const COOKIE_ATTRS: CookieAttributes = {
    path: "/",
    expires: 365,
    sameSite: "Lax",
};

export interface KeyValueStore {
    get(name: string): unknown;
    set(name: string, value: unknown): void;
    remove(name: string): void;
}

export function cookieStorage(prefix: string): KeyValueStore {
    const key = (name: string) => `${prefix}:${name}`;
    return {
        get(name) {
            const raw = Cookies.get(key(name));
            if (raw === undefined) return undefined;
            try {
                return JSON.parse(raw);
            } catch {
                return undefined;
            }
        },
        set(name, value) {
            Cookies.set(key(name), JSON.stringify(value), COOKIE_ATTRS);
        },
        remove(name) {
            Cookies.remove(key(name), { path: COOKIE_ATTRS.path });
        },
    };
}
