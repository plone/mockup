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

/** Strip a trailing slash (so url joins/comparisons are stable). */
function stripTrailingSlash(url) {
    return (url || "").replace(/\/+$/, "");
}

/**
 * Build the breadcrumb trail the filemanager actually renders, spanning the
 * whole portal rather than stopping at the navigation root.
 *
 * plone.restapi's @breadcrumbs stops at the navigation root: its `items` never
 * include the navigation root or anything above it, and `root` points at the
 * navigation root. In plone.app.multilingual the language folders (/en, /de)
 * are INavigationRoot, so browsing /en/foo returns root=/en and items=[foo] —
 * /en itself is never listed and "Home" would jump to /en, trapping the user
 * inside one language with no way to climb to the portal root and switch.
 *
 * Up-navigation (canGoUp/parentUrl) is already scoped to config.portalUrl, so
 * the trail should match: we rebuild the crumbs the endpoint omits — every
 * path segment from the portal root down to and including the navigation root
 * — from the url, and rebase "Home" on the portal root. The segment id (the
 * language code for a language root folder) is used as the crumb title.
 *
 * For ordinary sites the navigation root equals the portal root, so no crumbs
 * are added and the trail is unchanged.
 *
 * @param {{items: Array, root: string|null, portalUrl: string}} args
 * @returns {{items: Array<{"@id": string, title: string}>, home: string}}
 */
export function buildBreadcrumbTrail({ items = [], root = null, portalUrl }) {
    const portal = stripTrailingSlash(portalUrl);
    const navRoot = stripTrailingSlash(root);
    const ancestors = [];
    // Only fill the gap when the navigation root sits strictly below the portal
    // root (the multilingual / subsite case); guard with the "/" boundary so a
    // shared prefix like /plone vs /plone-two can't be mistaken for an ancestor.
    if (navRoot && navRoot !== portal && navRoot.startsWith(`${portal}/`)) {
        let url = portal;
        for (const seg of navRoot.slice(portal.length + 1).split("/")) {
            url = `${url}/${seg}`;
            ancestors.push({ "@id": url, title: seg });
        }
    }
    return { items: [...ancestors, ...items], home: portal };
}
