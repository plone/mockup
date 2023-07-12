import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";

// This pattern

export const parser = new Parser("contentbrowser");

const portalUrl = document.body.dataset["portalUrl"];

parser.addArgument(
    "vocabulary-url",
    `${portalUrl}/@@getVocabulary?name=plone.app.vocabularies.Catalog`
);
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
    ],
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
    ],
    true
);
parser.addArgument("max-depth", "200");
// parser.addArgument("base-path", `/`);
parser.addArgument("max-selectionsize", "9999");
// parser.addArgument("selectable-types", [],[], true);
//parser.addArgument("selectable-types", [],[], true);
// parser.addArgument("selection", []);

class Pattern extends BasePattern {
    static name = "contentbrowser";
    static trigger = ".pat-contentbrowser";
    static parser = parser;

    async init() {
        const ContentBrowser = (await import("./src/ContentBrowser.svelte")).default;
        const SelectedItems = (await import("./src/SelectedItems.svelte")).default;
        console.log("init ContentBrowser patter with options: ", this.options);

        const contentBrowserEl = document.createElement("div");
        contentBrowserEl.classList.add("content-browser-wrapper");
        const bodyElement = document.querySelector("body");
        bodyElement.append(contentBrowserEl);

        this.component_instance_browser = new ContentBrowser({
           target: contentBrowserEl,
           props: {
               maxDepth: this.options.max.depth,
               basePath: this.options.basePath,
               attributes: this.options.attributes,
               vocabularyUrl: this.options.vocabularyUrl,
           },
        });

        const selectedItemsEl = document.createElement("div");
        selectedItemsEl.classList.add("selected-items");
        this.el.parentNode.insertBefore(selectedItemsEl, this.el);

        this.el.setAttribute('style', 'display: none');
        this.component_instance_sel_items = new SelectedItems({
           target: selectedItemsEl,
           props: {
               maxSelectionsize: this.options.max.selectionsize,
               selectedItemsNode: this.el,
           },
        });
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
