import { request } from "./client.js";

// Write operations against plone.restapi. All endpoints are stock restapi
// services (copymove, content delete, ordering/default_page deserializers) —
// no pat-structure custom JSON views. See spec §3 / §9 for the mapping.

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
    const endpoint = op === "cut" ? "@move" : "@copy";
    return request(`${targetUrl}/${endpoint}`, {
        method: "POST",
        body: { source: sources },
    });
}

/** DELETE a single content item by its url. */
export function deleteItem(itemUrl) {
    return request(itemUrl, { method: "DELETE" });
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
    return request(containerUrl, { method: "PATCH", body: { ordering } });
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
