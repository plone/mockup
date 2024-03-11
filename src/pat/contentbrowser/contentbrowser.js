import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";

// Contentbrowser pattern

export const parser = new Parser("contentbrowser");

const portalUrl = document.body.dataset["portalUrl"];

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
parser.addArgument("maximum-selection-size", -1);
// parser.addArgument("selectable-types", [],[], true);
//parser.addArgument("selectable-types", [],[], true);
parser.addArgument("separator", ";");
parser.addArgument("selection", []);

class Pattern extends BasePattern {
    static name = "contentbrowser";
    static trigger = ".pat-contentbrowser";
    static parser = parser;

    async init() {
        this.el.setAttribute('style', 'display: none');

        // ensure an id on our elemen (eg TinyMCE doesn't have one)
        let nodeId = this.el.getAttribute("id");
        if (!nodeId) {
            nodeId = utils.generateId();
            this.el.setAttribute("id", nodeId);
        }

        const SelectedItems = (await import("./src/SelectedItems.svelte")).default;

        let contentBrowserEl = document.querySelector(".content-browser-wrapper");

        if (!contentBrowserEl) {
            // create wrapper only once
            contentBrowserEl = document.createElement("div");
            contentBrowserEl.classList.add("content-browser-wrapper");
            const bodyElement = document.querySelector("body");
            bodyElement.append(contentBrowserEl);
        }

        const selectedItemsEl = document.createElement("div");
        selectedItemsEl.classList.add("selected-items");
        this.el.parentNode.insertBefore(selectedItemsEl, this.el);

        this.component_instance_sel_items = new SelectedItems({
            target: selectedItemsEl,
            props: {
                maximumSelectionSize: this.options.maximumSelectionSize,
                selectedItemsNode: this.el,
                contentBrowserWrapperNode: contentBrowserEl,
                ...this.options,
            },
        });
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
