import logger from "@patternslib/patternslib/src/core/logging";

const log = logger.getLogger("pat-filemanager");

export class RestapiError extends Error {
    constructor(message, { status, body } = {}) {
        super(message);
        this.name = "RestapiError";
        this.status = status;
        this.body = body;
    }
}

/**
 * Thin wrapper around fetch for plone.restapi calls.
 *
 * Always sends/accepts application/json and includes same-origin credentials
 * (the logged-in Plone session cookie). plone.restapi exempts its own services
 * from plone.protect CSRF, so no _authenticator is needed.
 *
 * @param {string} url - absolute or root-relative endpoint url
 * @param {object} [opts]
 * @param {string} [opts.method="GET"]
 * @param {object} [opts.body] - serialized to JSON for write verbs
 * @param {object} [opts.params] - appended as query string
 * @param {object} [opts.headers]
 * @returns {Promise<any>} parsed JSON, or null for 204 No Content
 */
export async function request(url, { method = "GET", body, params, headers } = {}) {
    let finalUrl = url;
    if (params) {
        const usp = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null) continue;
            if (Array.isArray(value)) {
                for (const v of value) usp.append(key, v);
            } else {
                usp.append(key, value);
            }
        }
        const qs = usp.toString();
        if (qs) finalUrl += (finalUrl.includes("?") ? "&" : "?") + qs;
    }

    const requestHeaders = new Headers(headers);
    requestHeaders.set("Accept", "application/json");

    const init = { method, headers: requestHeaders, credentials: "same-origin" };
    if (body !== undefined) {
        requestHeaders.set("Content-Type", "application/json");
        init.body = JSON.stringify(body);
    }

    log.debug(`${method} ${finalUrl}`, body);

    const response = await fetch(finalUrl, init);

    if (response.status === 204) {
        return null;
    }

    let payload = null;
    const text = await response.text();
    if (text) {
        try {
            payload = JSON.parse(text);
        } catch {
            payload = text;
        }
    }

    if (!response.ok) {
        const message =
            (payload && payload.error && payload.error.message) ||
            (payload && payload.message) ||
            `Request failed with status ${response.status}`;
        throw new RestapiError(message, { status: response.status, body: payload });
    }

    return payload;
}
