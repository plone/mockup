import { request } from "./client.js";
import { api, toPath } from "./ploneClient.js";

// Write operations against plone.restapi. Stock restapi services — no
// pat-structure custom JSON views. The standard copymove / content-delete /
// ordering calls go through @plone/client; the ones the alpha client can't
// express yet (default_page, sort/rearrange, arbitrary-field PATCH for
// tags/properties/rename, link integrity) stay on the native-fetch `request()`.
// See spec §"hybrid @plone/client" and docs/upstream-plone-client.md.

/** Last path segment of a content url/path (the object id within its parent). */
export function objId(urlOrPath) {
    return String(urlOrPath || "")
        .split(/[?#]/)[0]
        .replace(/\/+$/, "")
        .split("/")
        .pop() || "";
}

/**
 * Cut/copy paste into a target container via @move (cut) or @copy (copy).
 *
 * @param {object} args
 * @param {string} args.targetUrl - container the items are pasted into
 * @param {string[]} args.sources - source urls/paths/uids to move or copy
 * @param {"cut"|"copy"} args.op
 * @returns {Promise<Array<{source:string,target:string}>>}
 */
export function pasteItems({ targetUrl, sources, op }) {
    const args = { path: toPath(targetUrl), data: { source: sources } };
    return op === "cut" ? api().moveContent(args) : api().copyContent(args);
}

/** DELETE a single content item by its url. */
export function deleteItem(itemUrl) {
    return api().deleteContent({ path: toPath(itemUrl) });
}

/**
 * Delete several items, sequentially (one DELETE each — restapi has no bulk
 * delete). Resolves once all are gone. `onStep(done, total)` (optional) is
 * called after each delete so callers can show progress.
 */
export async function deleteItems(itemUrls, onStep) {
    let done = 0;
    for (const url of itemUrls) {
        await deleteItem(url);
        onStep?.(++done, itemUrls.length);
    }
}

/**
 * Check link integrity for a set of items (by UID) before deletion.
 * Returns an array of items; each entry has a `breaches` array listing the
 * sources that reference it — only items with breaches need to be surfaced.
 *
 * @param {string} contextUrl - base URL for the /@linkintegrity endpoint
 * @param {string[]} uids
 * @returns {Promise<Array<{title:string, "@id":string, breaches:Array}>>}
 */
export function checkLinkIntegrity(contextUrl, uids) {
    if (uids.length === 0) return Promise.resolve([]);
    const params = new URLSearchParams();
    for (const uid of uids) params.append("uids", uid);
    return request(`${contextUrl}/@linkintegrity?${params}`);
}

/**
 * Reorder one item within its container via the OrderingMixin deserializer.
 *
 * @param {object} args
 * @param {string} args.containerUrl
 * @param {string} args.id - the object id to move
 * @param {"top"|"bottom"|number} args.delta - absolute position or relative shift
 * @param {string[]} [args.subsetIds] - current server order of the visible subset
 *   (required for relative moves in a filtered/batched view; must match the
 *   server order or restapi answers 400)
 */
export function moveItem({ containerUrl, id, delta, subsetIds }) {
    const ordering = { obj_id: id, delta };
    if (subsetIds) ordering.subset_ids = subsetIds;
    return api().updateContent({ path: toPath(containerUrl), data: { ordering } });
}

/** Set the container's default page to one of its children (by id). */
export function setDefaultPage({ containerUrl, id }) {
    return request(containerUrl, { method: "PATCH", body: { default_page: id } });
}

/**
 * PATCH one content item with a partial body.
 *
 * Used by the batch modals (tags, properties, rename). Stock content update —
 * the deserializer only writes schema fields / ordering / layout it recognises,
 * ignoring the rest. Rename mirrors Volto: send `{id, title}` (id-honouring
 * depends on backend support; see spec §9).
 */
export function patchItem(itemUrl, data) {
    return request(itemUrl, { method: "PATCH", body: data });
}

/**
 * PATCH the same body into several items sequentially (no bulk PATCH in
 * restapi). Resolves once all are done. `onStep(done, total)` (optional) is
 * called after each PATCH so callers can show progress.
 */
export async function patchItems(itemUrls, data, onStep) {
    let done = 0;
    for (const url of itemUrls) {
        await patchItem(url, data);
        onStep?.(++done, itemUrls.length);
    }
}

/**
 * Sort all items in a folder by a catalog index in one server call, via the
 * OrderingMixin `sort` deserializer (replaces the legacy `/rearrange` endpoint).
 * After the call the folder's `getObjPositionInParent` index reflects the new
 * order, so switching to manual-order mode shows the rearranged listing.
 *
 * @param {object} args
 * @param {string} args.containerUrl
 * @param {string} args.sortOn  - catalog index, e.g. "sortable_title" or "modified"
 * @param {"ascending"|"descending"} args.sortOrder
 */
export function rearrangeFolder({ containerUrl, sortOn, sortOrder }) {
    return request(containerUrl, {
        method: "PATCH",
        body: { sort: { on: sortOn, order: sortOrder } },
    });
}
