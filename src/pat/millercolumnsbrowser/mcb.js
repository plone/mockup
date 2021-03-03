//import $ from "jquery";
import _ from "underscore";
import Base from "patternslib/src/core/base";
import Parser from "patternslib/src/core/parser";
import _t from "../../core/i18n-wrapper";
//import utils from "../../core/utils";

// This pattern
import registry from "patternslib/src/core/registry";
import MillerColumnsBrowser from "./src/MillerColumnsBrowser.svelte";
const parser = new Parser("contentbrowser");

parser.addArgument(
    "vocabulary-url",
    "http://localhost:8081/Plone/@@getVocabulary"
);
parser.addArgument(
    "attributes",
    [
        "UID",
        "Title",
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
        "portal_type",
        "path",
        "getURL",
        "getIcon",
        "is_folderish",
        "review_state",
    ],
    true
);
parser.addArgument("max-depth", "2");
parser.addArgument("base-path", "/Plone14");

//import "./relateditems.scss";

// const KEY = {
//     LEFT: 37,
//     RIGHT: 39,
// };

export default Base.extend({
    name: "contentbrowser",
    trigger: ".pat-contentbrowser",
    //parser: "mockup",

    isSelectable: function (item) {
        var self = this;
        if (item.selectable === false) {
            return false;
        }
        if (self.options.selectableTypes === null) {
            return true;
        } else {
            return (
                self.options.selectableTypes.indexOf(item.portal_type) !== -1
            );
        }
    },

    init: function () {
        console.log("init mcb");
        this.options = parser.parse(this.el, this.options);
        console.log("self.options: ", this.options);
        this.component_instance = new MillerColumnsBrowser({
            target: this.el,
            // hydrate: true,
            props: {
                maxDepth: this.options.maxDepth,
                basePath: this.options.basePath,
                attributes: this.options.attributes,
                vocabularyUrl: this.options.vocabularyUrl,
            },
        });
    },
});
