import { request } from "./client.js";
import { objId } from "./operations.js";

// Workflow operations against plone.restapi's @workflow service. Recursion is
// server-side: POST {item}/@workflow/{transition} with include_children walks
// descendants in one call (no client-side @search sweep). See spec §3 / §9.

/** GET the workflow info for one item: `{state, history, transitions:[{@id,title}]}`. */
export function fetchWorkflow(itemUrl) {
    return request(`${itemUrl}/@workflow`);
}

/**
 * Trigger one transition on one item.
 *
 * @param {object} args
 * @param {string} args.itemUrl
 * @param {string} args.transition - transition id
 * @param {string} [args.comment]
 * @param {boolean} [args.includeChildren] - recurse into descendants (server-side)
 * @param {string} [args.effective] - optional publication date (ISO)
 * @param {string} [args.expires] - optional expiration date (ISO)
 */
export function transitionItem({
    itemUrl,
    transition,
    comment = "",
    includeChildren = false,
    effective,
    expires,
}) {
    const body = { comment, include_children: includeChildren };
    if (effective !== undefined) body.effective = effective;
    if (expires !== undefined) body.expires = expires;
    return request(`${itemUrl}/@workflow/${transition}`, { method: "POST", body });
}

/**
 * Collect the union of available transitions across several items, deduped by
 * transition id (mirrors Volto's batch-workflow dropdown). Items where a chosen
 * transition is not applicable are tolerated at apply time (the server answers
 * 400 and the caller records it).
 *
 * @param {string[]} itemUrls
 * @returns {Promise<Array<{id: string, title: string}>>}
 */
export async function fetchTransitions(itemUrls) {
    const byId = new Map();
    for (const url of itemUrls) {
        const wf = await fetchWorkflow(url);
        for (const t of wf?.transitions || []) {
            const id = objId(t["@id"]);
            if (id && !byId.has(id)) byId.set(id, { id, title: t.title || id });
        }
    }
    return [...byId.values()];
}
