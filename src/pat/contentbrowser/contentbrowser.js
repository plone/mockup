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
parser.addArgument("unmarked-review-states");

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
        if (this.destroyed) {
            // BasePattern runs init() on a timer, even after destroy(), and
            // registers the instance on the element right before.
            super.destroy();
            return;
        }

        this.previous_display = this.el.style.display;
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
        const [{ mount, unmount }, { default: ContentBrowserApp }] = await Promise.all([
            import("svelte"),
            import("./src/App.svelte"),
        ]);
        // destroy() needs unmount, but svelte is only imported lazily here.
        this._svelte_unmount = unmount;
        // A JS framework host can destroy or remove the widget while the
        // imports above are pending: there is nothing left to mount into.
        if (this.destroyed) {
            return;
        }
        if (!this.el.isConnected) {
            // Release the input, so that it works again when it is reinserted.
            this.destroy();
            return;
        }

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
        this.content_browser_el = contentBrowserEl;
    }

    destroy() {
        this.destroyed = true;
        // Unmount the Svelte app so its reactive effects stop; otherwise it
        // keeps writing selection state into the (possibly removed) input,
        // e.g. when a JS framework host unmounts the widget after selection.
        if (this.component_content_browser) {
            this._svelte_unmount?.(this.component_content_browser);
            this.component_content_browser = null;
        }
        this.content_browser_el?.remove();
        this.content_browser_el = null;
        if (this.previous_display !== undefined) {
            this.el.style.display = this.previous_display;
        }
        super.destroy();
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
