import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";
import plone_registry from "@plone/registry";

// Contentbrowser pattern

export const parser = new Parser("contentbrowser");

parser.addArgument("vocabulary-url");
parser.addArgument(
    "attributes",
    [
        "UID",
        "Title",
        "Description",
        "portal_type",
        "path",
        "getURL",
        "getIcon",
        "is_folderish",
        "review_state",
        "created",
        "modified",
    ], null, true
);
parser.addArgument("width");
parser.addArgument("mode");
parser.addArgument("max-depth");
parser.addArgument("root-path");
parser.addArgument("root-url");
parser.addArgument("base-path");
parser.addArgument("context-path");
parser.addArgument("maximum-selection-size");
parser.addArgument("selectable-types");
parser.addArgument("browseable-types");
parser.addArgument("search-index");
parser.addArgument("separator");
parser.addArgument("selection");
parser.addArgument("selection-template");
parser.addArgument("favorites");
parser.addArgument("recently-used");
parser.addArgument("recently-used-key");
parser.addArgument("recently-used-max-items");
parser.addArgument("b-size");
parser.addArgument("sort-on");
parser.addArgument("sort-order");

class Pattern extends BasePattern {
    static name = "contentbrowser";
    static trigger = ".pat-contentbrowser";
    static parser = parser;

    async init() {
        this.el.style.display = "none";

        // register default components in @plone/registry
        const SelectedItem = (await import("./src/SelectedItem.svelte")).default;

        plone_registry.registerComponent({
            name: "pat-contentbrowser.SelectedItem",
            component: SelectedItem,
        });

        // ensure an id on our element (TinyMCE doesn't have one)
        let nodeId = this.el.getAttribute("id");
        if (!nodeId) {
            nodeId = utils.generateId();
            this.el.setAttribute("id", nodeId);
        }

        const ContentBrowserApp = (await import("./src/App.svelte")).default;

        // create browser node
        const contentBrowserEl = document.createElement("div");
        contentBrowserEl.classList.add("content-browser-wrapper");
        this.el.parentNode.insertBefore(contentBrowserEl, this.el);

        this.component_content_browser = new ContentBrowserApp({
            target: contentBrowserEl,
            props: {
                fieldId: nodeId,
                ...this.options,
            }
        });
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
