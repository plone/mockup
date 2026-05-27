import { request } from "./client.js";

/**
 * Fetch a named vocabulary via plone.restapi's @vocabularies service.
 *
 * Returns the full term list (b_size=-1 disables batching server-side). Each
 * term serialises as `{token, title}`. Used for workflow transitions and the
 * language field in the properties modal.
 *
 * @param {string} contextUrl - absolute url of the folder
 * @param {string} name - vocabulary name (e.g. "plone.app.vocabularies.AvailableContentLanguages")
 * @returns {Promise<Array<{token: string, title: string}>>}
 */
export async function fetchVocabulary(contextUrl, name) {
    const data = await request(`${contextUrl}/@vocabularies/${name}`, {
        params: { b_size: "-1" },
    });
    return (data?.items || []).map((t) => ({ token: t.token, title: t.title }));
}
