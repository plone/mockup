// What the tests of the content browser share: a field on the page, a
// vocabulary behind it and the stubs jsdom needs.
import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

export const vocabularyUrl = "http://localhost/plone/@@getVocabulary";

/** An item as the vocabulary delivers it. */
export const item = (uid, values = {}) => ({
    "UID": uid,
    "Title": uid,
    "@id": `http://localhost/plone/${uid}`,
    "path": `/plone/${uid}`,
    "portal_type": "Document",
    "getIcon": "",
    "is_folderish": false,
    "review_state": "published",
    "getURL": `http://localhost/plone/${uid}`,
    ...values,
});

/** Answer the vocabulary requests with `items`: an array, or a function
 * which returns the items of the moment.
 *
 * The selected items are looked up with a POST which names their UIDs,
 * everything else lists the whole vocabulary.
 */
export function mockVocabulary(items) {
    global.fetch = jest.fn(async (url, options = {}) => {
        let results = typeof items === "function" ? items() : items;
        if (options.method === "POST") {
            const query = JSON.parse(new URLSearchParams(options.body).get("query"));
            const uids = String(query.criteria[0].v).split(",");
            results = results.filter((it) => uids.includes(it.UID));
        }
        return {
            ok: true,
            json: async () => ({ results, total: results.length }),
        };
    });
}

/** Wait for an element by its selector, or until `find` returns something. */
export async function waitFor(find) {
    const look = typeof find === "string" ? () => document.querySelector(find) : find;
    for (let attempt = 0; attempt < 200; attempt += 1) {
        const found = look();
        if (found) {
            return found;
        }
        await utils.timeout(10);
    }
    throw new Error(`${find} found nothing`);
}

/** Put a field with the pattern on the page. `changes` collects the value
 * of the field at each of its change events.
 */
export async function mountField(value = "", options = {}) {
    options = { vocabularyUrl, ...options };
    document.body.innerHTML = `
        <input type="text" value="${value}" class="pat-contentbrowser"
               data-pat-contentbrowser='${JSON.stringify(options)}'>
    `;
    const input = document.querySelector("input.pat-contentbrowser");
    const changes = [];
    input.addEventListener("change", () => changes.push(input.value));
    registry.scan(document.body);
    await utils.timeout(1);
    return { input, changes };
}

/** Open the browser of the field on the page. */
export async function openBrowser() {
    (await waitFor(".content-browser-selected-items-wrapper a.btn")).click();
}

/** Stub what jsdom lacks before each test and clean up after it. */
export function setupBrowserTests() {
    beforeEach(() => {
        // jsdom has neither, and the browser's transition needs animate()
        Element.prototype.scrollTo = jest.fn();
        Element.prototype.animate = jest.fn(() => ({ cancel: () => {} }));
    });

    afterEach(() => {
        document.body.innerHTML = "";
        delete global.fetch;
        delete Element.prototype.scrollTo;
        delete Element.prototype.animate;
    });
}
