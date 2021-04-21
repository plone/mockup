import Base from "patternslib/src/core/base";
import Parser from "patternslib/src/core/parser";

// This pattern
import ContentBrowser from "./src/ContentBrowser.svelte";
import SelectedItems from "./src/SelectedItems.svelte";

const parser = new Parser("contentbrowser");

parser.addArgument(
    "vocabulary-url",
    "http://localhost:8080/Plone14/@@getVocabulary?name=plone.app.vocabularies.Catalog"
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
parser.addArgument("base-path", "/Plone14");
parser.addArgument("max-selectionsize", "9999");
// parser.addArgument("selectable-types", [],[], true);
//parser.addArgument("selectable-types", [],[], true);


export default Base.extend({
    name: "contentbrowser",
    trigger: ".pat-contentbrowser",
    //parser: "mockup",

    init: function () {
        console.log("init ContentBrowser patter with options: ", this.options)
        this.options = parser.parse(this.el, this.options);

        const contentBrowserEl = document.createElement("div");
        contentBrowserEl.classList.add('content-browser-wrapper');
        const bodyElement = document.querySelector("body");
        bodyElement.append(contentBrowserEl);

        console.log("pat-contentbrowser options", this.options);
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
        selectedItemsEl.classList.add('selected-items');
        this.el.parentNode.insertBefore(selectedItemsEl, this.el);

        // this.el.setAttribute('style', 'display: none');
        this.component_instance_sel_items = new SelectedItems({
            target: selectedItemsEl,
            props: {
                maxSelectionsize: this.options.max.selectionsize,
                selectedItemsNode: this.el,
            },
        });
    },
});
