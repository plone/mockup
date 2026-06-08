import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";
import { mount } from "svelte";

// pat-filemanager — Svelte 5 rewrite of pat-structure folder contents, talking
// only to plone.restapi. P1: read-only batched listing with server-side sort.

export const parser = new Parser("filemanager");

// Critical, layout-affecting CSS injected synchronously on first init — kept in
// sync with the matching rules in filemanager.css. The full stylesheet is loaded
// as a lazy chunk (import("./filemanager.css")), which arrives a network
// round-trip later; if these rules waited for it, the Plone header/nav would
// paint and then vanish, flickering on every first load, and the listing area
// would stay blank with no feedback until the Svelte bundle finished loading.
// Applying them inline the moment the pattern is scanned fixes both without
// un-lazying the rest of the styles.
//
// The spinner is shown via :not(:has(.pat-filemanager-app)): the Svelte app
// mounts a .pat-filemanager-app root into the element, so the spinner shows from
// the first paint and disappears automatically the instant the app renders.
const CRITICAL_CSS = `
body:has(.pat-filemanager) #content-header,
body:has(.pat-filemanager) #mainnavigation-wrapper,
body:has(.pat-filemanager) #above-content-wrapper,
body:has(.pat-filemanager) footer {
    display: none;
}

.pat-filemanager:not(:has(.pat-filemanager-app)) {
    display: block;
    min-height: 8rem;
}

.pat-filemanager:not(:has(.pat-filemanager-app))::after {
    content: "";
    display: block;
    box-sizing: border-box;
    width: 2.5rem;
    height: 2.5rem;
    margin: 5rem auto 3rem;
    border: 3px solid var(--bs-border-color, #dee2e6);
    border-top-color: var(--bs-primary, #0d6efd);
    border-radius: 50%;
    animation: pat-filemanager-spin 0.7s linear infinite;
}

@keyframes pat-filemanager-spin {
    to {
        transform: rotate(360deg);
    }
}
`;

const CRITICAL_CSS_ID = "pat-filemanager-critical-css";

export function injectCriticalCss() {
    if (document.getElementById(CRITICAL_CSS_ID)) {
        return;
    }
    const style = document.createElement("style");
    style.id = CRITICAL_CSS_ID;
    style.textContent = CRITICAL_CSS;
    document.head.appendChild(style);
}

// No defaults here on purpose: the data attribute carries camelCase keys, and a
// non-undefined parser default would overwrite the supplied value during the
// parser's hyphenated->camelCase cleanup. Defaults live in App.svelte props.
parser.addArgument("context-url");
parser.addArgument("portal-url");
parser.addArgument("context-path");
parser.addArgument("active-columns");
parser.addArgument("available-columns");
parser.addArgument("portal-types");
parser.addArgument("search-index");
parser.addArgument("default-batch-size");
parser.addArgument("sort-on");
parser.addArgument("sort-order");
parser.addArgument("default-view");
parser.addArgument("folder-type");
parser.addArgument("view-action-types");

class Pattern extends BasePattern {
    static name = "filemanager";
    static trigger = ".pat-filemanager";
    static parser = parser;

    async init() {
        // Apply the chrome-hiding rule immediately so the Plone header does not
        // flash before the lazy stylesheet chunk lands.
        injectCriticalCss();
        import("./filemanager.css");

        // ensure an id on our element
        let nodeId = this.el.getAttribute("id");
        if (!nodeId) {
            nodeId = utils.generateId();
            this.el.setAttribute("id", nodeId);
        }

        // default context-url to the current location if not supplied, dropping
        // a trailing folder_contents view name so restapi calls hit the folder
        // (the view itself is not a valid @querystring-search traversal target).
        const contextUrl =
            this.options.contextUrl ||
            window.location.href
                .split("?")[0]
                .replace(/\/(?:@@)?folder_contents\/?$/, "")
                .replace(/\/+$/, "");

        // Scope navigation (breadcrumbs / "go up") to the portal root. The
        // folder_contents view (shared with pat-structure) exposes it as
        // urlStructure.base — i.e. get_top_site_from_url(), the topmost TTW site.
        // Honouring it lets the user climb out of a navigation root such as a
        // plone.app.multilingual language folder (/en, /de, which are
        // INavigationRoot) back to the portal root, instead of being trapped at
        // the language root the way a context-only fallback would leave them.
        const portalUrl =
            this.options.portalUrl || this.options.urlStructure?.base || "";

        const App = (await import("./src/App.svelte")).default;

        this.component = mount(App, {
            target: this.el,
            props: {
                ...this.options,
                contextUrl,
                portalUrl,
            },
        });
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
