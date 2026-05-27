import { request } from "./client.js";

/**
 * Fetch the plone.app.querystring registry config via @querystring.
 *
 * Replaces the legacy `indexOptionsUrl` filter-widget contract. The reply
 * contains `indexes` (per-index metadata: title, enabled, operations,
 * vocabulary `values`, …) and `sortable_indexes`.
 *
 * @param {string} contextUrl - absolute url of the folder
 * @returns {Promise<{indexes: object, sortable_indexes: object}>}
 */
export async function fetchQuerystringConfig(contextUrl) {
    const data = await request(`${contextUrl}/@querystring`);
    return {
        indexes: data?.indexes || {},
        sortable_indexes: data?.sortable_indexes || {},
    };
}

/**
 * Extract the portal_type filter options from a @querystring config.
 *
 * The registry reader exposes vocabulary values as
 * `{ "Document": {title: "Page"}, … }`; flatten to a value/label list.
 *
 * @param {{indexes: object}} config
 * @returns {Array<{value: string, label: string}>}
 */
export function typeOptions(config) {
    const values = config?.indexes?.portal_type?.values || {};
    return Object.entries(values).map(([value, meta]) => ({
        value,
        label: (meta && meta.title) || value,
    }));
}
