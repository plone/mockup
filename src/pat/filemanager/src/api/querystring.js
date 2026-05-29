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

/**
 * Enabled indexes available to the query builder, as a flat option list with
 * their `group` for optgroup rendering. Mirrors pat-structure's QueryString
 * widget, which only offers indexes flagged `enabled` and with operations.
 *
 * @param {{indexes: object}} config
 * @returns {Array<{value: string, title: string, group: string}>}
 */
export function enabledIndexes(config) {
    const indexes = config?.indexes || {};
    return Object.entries(indexes)
        .filter(([, meta]) => meta && meta.enabled && (meta.operations || []).length)
        .map(([value, meta]) => ({
            value,
            title: meta.title || value,
            group: meta.group || "",
        }));
}

/**
 * The operations offered for one index, with their human title and the value
 * `widget` that decides how the value is edited (StringWidget, DateWidget, …).
 *
 * @param {{indexes: object}} config
 * @param {string} index
 * @returns {Array<{value: string, title: string, widget: string|null}>}
 */
export function operatorsForIndex(config, index) {
    const meta = config?.indexes?.[index];
    if (!meta) return [];
    return (meta.operations || []).map((op) => ({
        value: op,
        title: meta.operators?.[op]?.title || op,
        widget: meta.operators?.[op]?.widget || null,
    }));
}

/** The value widget for an index/operation pair (null = no value needed). */
export function widgetFor(config, index, operation) {
    return config?.indexes?.[index]?.operators?.[operation]?.widget || null;
}

/**
 * The vocabulary value/label pairs for a MultipleSelectionWidget index
 * (portal_type, review_state, Subject, …).
 *
 * @param {{indexes: object}} config
 * @param {string} index
 * @returns {Array<{value: string, label: string}>}
 */
export function selectionValues(config, index) {
    const values = config?.indexes?.[index]?.values || {};
    return Object.entries(values).map(([value, meta]) => ({
        value,
        label: (meta && meta.title) || value,
    }));
}

/**
 * Whether a criterion has the value its widget requires. Operations with no
 * widget (date.today, isTrue, …) are always satisfied; selection/date-range
 * values are arrays and need at least one entry.
 *
 * @param {string|null} widget
 * @param {unknown} value
 * @returns {boolean}
 */
export function hasValue(widget, value) {
    if (!widget) return true;
    if (Array.isArray(value)) {
        return value.some((v) => v !== "" && v != null);
    }
    return value !== "" && value != null;
}
