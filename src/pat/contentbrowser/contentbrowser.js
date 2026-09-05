import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";

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
parser.addArgument("upload");
parser.addArgument("upload-add-immediately");
parser.addArgument("upload-accepted-mimetypes");
parser.addArgument("sort-on");
parser.addArgument("sort-order");

class Pattern extends BasePattern {
    static name = "contentbrowser";
    static trigger = ".pat-contentbrowser";
    static parser = parser;

    static async register_default_components() {
        // @plone/registry is imported here, not at module level — a static
        // import would put it in the eager patterns chunk on every page.
        const { default: plone_registry } = await import("@plone/registry");

        // Register the default components in @plone/registry — but only if
        // nothing is registered under that key yet. This lets add-ons
        // replace a component site-wide by registering their own under the
        // default key, regardless of whether their bundle initializes before
        // or after this pattern (registerComponent overwrites silently).
        if (!plone_registry.getComponent("pat-contentbrowser.SelectedItem").component) {
            const SelectedItem = (await import("./src/SelectedItem.svelte")).default;
            plone_registry.registerComponent({
                name: "pat-contentbrowser.SelectedItem",
                component: SelectedItem,
            });
        }
    }

    async init() {
        this.el.style.display = "none";

        await Pattern.register_default_components();

        // ensure an id on our element (TinyMCE doesn't have one)
        let nodeId = this.el.getAttribute("id");
        if (!nodeId) {
            nodeId = utils.generateId();
            this.el.setAttribute("id", nodeId);
        }

        // svelte is imported here, not at module level — a static import would
        // pull the whole svelte runtime into the eager patterns chunk on every
        // page.
        const [{ mount }, { default: ContentBrowserApp }] = await Promise.all([
            import("svelte"),
            import("./src/App.svelte"),
        ]);

        // create browser node
        const contentBrowserEl = document.createElement("div");
        contentBrowserEl.classList.add("content-browser-wrapper");
        this.el.parentNode.insertBefore(contentBrowserEl, this.el);

        this.component_content_browser = mount(ContentBrowserApp, {
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
