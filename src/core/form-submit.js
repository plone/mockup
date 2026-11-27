/**
 * Submit a form in the background with fetch.
 *
 * This stands in for `$.fn.ajaxSubmit` of the jquery-form plugin, which does
 * not work with jQuery 4. The callbacks get the same arguments.
 *
 * @param {HTMLFormElement} form - The form to submit.
 * @param {Object} [settings]
 * @param {string} [settings.url] - Where to submit to. Default: the action of the form.
 * @param {Object} [settings.data] - Extra fields, e.g. the button which was clicked.
 * @param {HTMLElement} [settings.submitter] - The button which was clicked. Its name and value are submitted.
 * @param {number} [settings.timeout] - Milliseconds until the request is given up.
 * @param {Function} [settings.beforeSubmit] - Called before the request is sent.
 * @param {Function} [settings.success] - Called with (response, state, xhr, form).
 * @param {Function} [settings.error] - Called with (xhr, textStatus, errorStatus).
 *     textStatus is "timeout" or "error". Without a response xhr.status is 0.
 *
 * `xhr` is not an XMLHttpRequest. It has `status`, `statusText`,
 * `responseText`, `getResponseHeader` and `getAllResponseHeaders`.
 */
export default async function submitForm(form, settings = {}) {
    const formData = new FormData(form);
    const submitter = settings.submitter;
    if (submitter?.name && !formData.has(submitter.name)) {
        formData.append(submitter.name, submitter.value);
    }
    for (const [name, value] of Object.entries(settings.data || {})) {
        if (value !== undefined && value !== null) {
            formData.append(name, value);
        }
    }

    const method = (form.getAttribute("method") || "GET").toUpperCase();
    let url = settings.url || form.getAttribute("action") || window.location.href;
    const request = {
        method: method,
        credentials: "same-origin",
        // jQuery sets this header, and Plone looks for it in some places.
        headers: { "X-Requested-With": "XMLHttpRequest" },
    };
    if (method === "GET" || method === "HEAD") {
        const query = new URLSearchParams(formData).toString();
        if (query) {
            url += (url.includes("?") ? "&" : "?") + query;
        }
    } else {
        request.body = formData;
    }

    let timedOut = false;
    let timer;
    if (settings.timeout) {
        const controller = new AbortController();
        request.signal = controller.signal;
        timer = setTimeout(() => {
            timedOut = true;
            controller.abort();
        }, settings.timeout);
    }

    settings.beforeSubmit?.(form);

    let response;
    let text;
    try {
        response = await fetch(url, request);
        text = await response.text();
    } catch {
        // No response: timeout, or the server could not be reached.
        clearTimeout(timer);
        settings.error?.(
            { status: 0, statusText: "", responseText: "" },
            timedOut ? "timeout" : "error",
            timedOut ? "timeout" : "",
        );
        return;
    }
    clearTimeout(timer);

    const xhr = {
        status: response.status,
        statusText: response.statusText,
        responseText: text,
        getResponseHeader: (name) => response.headers.get(name),
        getAllResponseHeaders: () =>
            [...response.headers]
                .map(([name, value]) => `${name}: ${value}\r\n`)
                .join(""),
    };
    if (response.ok || response.status === 304) {
        settings.success?.(text, "success", xhr, form);
    } else {
        settings.error?.(xhr, "error", response.statusText);
    }
}
