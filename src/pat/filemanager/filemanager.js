import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";
import { mount } from "svelte";

// pat-filemanager — Svelte 5 rewrite of pat-structure folder contents, talking
// only to plone.restapi. P1: read-only batched listing with server-side sort.

export const parser = new Parser("filemanager");

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

class Pattern extends BasePattern {
    static name = "filemanager";
    static trigger = ".pat-filemanager";
    static parser = parser;

    async init() {
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

        const App = (await import("./src/App.svelte")).default;

        this.component = mount(App, {
            target: this.el,
            props: {
                ...this.options,
                contextUrl,
            },
        });
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
