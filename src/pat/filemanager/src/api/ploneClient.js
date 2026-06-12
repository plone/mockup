import PloneClient from "@plone/client";
import { RestapiError } from "./client.js";

// Shared @plone/client (aurora) instance for the restapi calls the official
// client can handle. The filemanager keeps its own native-fetch `request()`
// (client.js) for everything the alpha client can't do yet — the listing
// (@querystring-search with sort/batch), workflow transitions, rearrange /
// set-default-page, link integrity, tags/properties/rename, and tus upload.
// See src/api/README and pat-filemanager-spec §"hybrid @plone/client".

let _client = null;
let _apiPath = "";

/**
 * Initialise the singleton with the portal root as the API path. `apiSuffix: ""`
 * makes the client hit plone.restapi directly via content negotiation (no
 * `/++api++`), matching the native-fetch layer. Called once from App.svelte.
 */
export function initPloneClient(apiPath) {
    _apiPath = String(apiPath || "").replace(/\/+$/, "");
    _client = PloneClient.initialize({ apiPath: _apiPath, apiSuffix: "" });
    return _client;
}

/** The initialised client (throws if init was skipped). */
export function client() {
    if (!_client) {
        throw new Error("PloneClient not initialised — call initPloneClient() first");
    }
    return _client;
}

/**
 * The client with every service method routed through `unwrap`: calls resolve
 * to the response body and reject with a `RestapiError` — so call sites read
 * `api().deleteContent({path})` without repeating the adapter. Methods are
 * applied on the underlying instance (the services read `this.config`).
 */
export function api() {
    const c = client();
    return new Proxy(c, {
        get(target, prop) {
            const value = target[prop];
            if (typeof value !== "function") return value;
            return (...args) => unwrap(value.apply(target, args));
        },
    });
}

/**
 * Portal-relative path for a content url. The client prefixes `apiPath`, and its
 * services build their own `@id`/`@move`/`@breadcrumbs` subpaths off this path,
 * so we strip the portal prefix and keep a leading slash.
 */
export function toPath(url) {
    const clean = String(url || "").split(/[?#]/)[0].replace(/\/+$/, "");
    let path =
        _apiPath && clean.startsWith(_apiPath)
            ? clean.slice(_apiPath.length)
            : new URL(clean).pathname.replace(/\/+$/, "");
    if (!path.startsWith("/")) path = `/${path}`;
    return path || "/";
}

/**
 * Await a @plone/client call and return the response body. The client resolves
 * to an axios response (payload in `.data`) and rejects with a plain
 * `{ status, data, location }` object — translate both so callers keep seeing
 * the parsed payload and a `RestapiError` with `.message`/`.status`/`.body`,
 * exactly as the native-fetch `request()` layer produced.
 */
export async function unwrap(promise) {
    let response;
    try {
        response = await promise;
    } catch (err) {
        if (err instanceof RestapiError) throw err;
        const status = err?.status;
        const body = err?.data;
        const message =
            body?.error?.message ||
            body?.message ||
            `Request failed${status != null ? ` (${status})` : ""}`;
        throw new RestapiError(message, { status, body });
    }
    return response?.data;
}
