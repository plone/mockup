// Keep the Plone content header (title / byline / description) in sync with the
// folder being browsed in-app. The header lives OUTSIDE the mounted app — it is
// the server-rendered `#content > header` (CMFPlone main_template.pt): the
// `@@title` h1, the below-content-title viewlet (which renders the byline
// `#section-byline`), and the `@@description`.
//
// Rather than re-fetch fields over restapi and rebuild the byline (restapi only
// exposes creator *ids*, not fullnames, and the dates are localized/i18n
// server-side), we fetch the target context's HTML and transplant its whole
// header node. The byline — author, localized published/modified dates, expired
// flag — comes through verbatim because it is the server's own markup.

/** Fetch a context's rendered HTML (same-origin Plone page). */
export async function fetchContextHtml(
    contextUrl: string,
    signal?: AbortSignal
): Promise<string> {
    const response = await fetch(contextUrl, {
        credentials: "same-origin",
        headers: { Accept: "text/html" },
        signal,
    });
    if (!response.ok) {
        throw new Error(`Could not load header for ${contextUrl} (status ${response.status})`);
    }
    return response.text();
}

/**
 * Replace the live header (`selector`, default "#content > header") with the
 * one parsed from `html`, and update `doc.title`. Both the fetched and the live
 * header must exist; otherwise this is a no-op. Returns whether it swapped.
 *
 * The markup is trusted same-origin Plone output, so importing it wholesale is
 * safe. `replaceChildren` keeps the live <header> element (and its attributes)
 * and only swaps its contents.
 */
export function swapContextHeader(
    html: string,
    selector: string,
    doc: Document = document
): boolean {
    const live = doc.querySelector(selector);
    if (!live) return false;

    const parsed = new DOMParser().parseFromString(html, "text/html");
    const fresh = parsed.querySelector(selector);
    if (!fresh) return false;

    const imported = Array.from(fresh.childNodes).map((node) => doc.importNode(node, true));
    live.replaceChildren(...imported);

    const title = parsed.querySelector("title")?.textContent;
    if (title) doc.title = title;

    return true;
}
