import { request } from "./client.js";

const PATH_OP = "plone.app.querystring.operation.string.path";
const TYPE_OP = "plone.app.querystring.operation.selection.any";
const TEXT_OP = "plone.app.querystring.operation.string.contains";

/**
 * Build the plone.app.querystring criteria list for a folder listing.
 *
 * @param {object} args
 * @param {string} args.path - physical path of the folder to list
 * @param {number} [args.depth=1] - path depth (1 = direct children)
 * @param {string[]} [args.portalTypes] - restrict to these types
 * @param {string} [args.searchableText] - free-text filter
 * @param {string} [args.searchIndex="SearchableText"]
 * @param {Array} [args.extraCriteria] - additional raw criteria from the filter widget
 * @returns {Array} criteria
 */
export function buildCriteria({
    path,
    depth = 1,
    portalTypes = [],
    searchableText = "",
    searchIndex = "SearchableText",
    extraCriteria = [],
} = {}) {
    const criteria = [
        { i: "path", o: PATH_OP, v: `${path}::${depth}` },
    ];
    if (portalTypes.length) {
        criteria.push({ i: "portal_type", o: TYPE_OP, v: portalTypes });
    }
    if (searchableText) {
        criteria.push({ i: searchIndex, o: TEXT_OP, v: searchableText });
    }
    return [...criteria, ...extraCriteria];
}

/**
 * Criteria matching a whole subtree (the item itself and all descendants).
 *
 * Omitting the `::depth` suffix lets the catalog path index match every object
 * beneath `path`. @querystring-search additionally excludes the context's own
 * UID, so calling it on the item's url yields just the descendants — which is
 * exactly what the recursive properties walk needs.
 *
 * @param {string} path - physical path of the subtree root
 * @returns {Array} criteria
 */
export function buildSubtreeCriteria(path) {
    return [{ i: "path", o: PATH_OP, v: path }];
}

/**
 * List folder contents via plone.restapi @querystring-search.
 *
 * Uses POST so that metadata_fields is read from the JSON body (GET resets
 * request.form) and so long UID lists don't overflow the URL. Sorting is done
 * by the catalog over the whole result set before batching, which is the core
 * fix vs. the legacy DataTables (current-batch-only) sorting.
 *
 * NOTE: @querystring-search excludes the context's own UID from results, so
 * call it on the folder being listed.
 *
 * @param {object} args
 * @param {string} args.contextUrl - absolute url of the folder (endpoint base)
 * @param {Array} args.criteria - querystring criteria (see buildCriteria)
 * @param {string} [args.sortOn] - catalog index to sort on (dates sort as dates)
 * @param {string} [args.sortOrder] - "ascending" | "descending"
 * @param {number} [args.bStart=0] - batch start offset
 * @param {number} [args.bSize=25] - batch size
 * @param {number} [args.limit=1000] - hard result cap
 * @param {string[]} [args.metadataFields=["_all"]] - catalog columns to return
 * @param {boolean} [args.fullobjects=false]
 * @returns {Promise<{items: Array, total: number, batching: object|null}>}
 */
export async function searchContents({
    contextUrl,
    criteria,
    sortOn,
    sortOrder,
    bStart = 0,
    bSize = 25,
    limit = 1000,
    metadataFields = ["_all"],
    fullobjects = false,
}) {
    const body = {
        query: criteria,
        b_start: bStart,
        b_size: bSize,
        limit,
        metadata_fields: metadataFields,
        fullobjects,
    };
    if (sortOn) body.sort_on = sortOn;
    if (sortOrder) body.sort_order = sortOrder;

    const data = await request(`${contextUrl}/@querystring-search`, {
        method: "POST",
        body,
    });

    return {
        items: data?.items || [],
        total: data?.items_total ?? 0,
        batching: data?.batching || null,
    };
}
