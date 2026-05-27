import { request } from "./client.js";

/**
 * Fetch the breadcrumb trail for a context via plone.restapi @breadcrumbs.
 *
 * @param {string} contextUrl - absolute url of the folder
 * @returns {Promise<{items: Array<{"@id": string, title: string}>, root: string|null}>}
 */
export async function fetchBreadcrumbs(contextUrl) {
    const data = await request(`${contextUrl}/@breadcrumbs`);
    return {
        items: data?.items || [],
        root: data?.root || null,
    };
}
