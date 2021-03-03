import Base from "patternslib/src/core/base";
import Parser from "patternslib/src/core/parser";

// This pattern
import MillerColumnsBrowser from "./src/MillerColumnsBrowser.svelte";

const parser = new Parser("contentbrowser");
parser.addArgument("vocabulary-url", "http://localhost:8081/Plone/@@getVocabulary"); // prettier-ignore
parser.addArgument("attributes", "UID, Title, portal_type, path, getURL, getIcon, is_folderish, review_state"); // prettier-ignore
parser.addArgument("max-depth", 1);

export default Base.extend({
    name: "contentbrowser",
    trigger: ".pat-contentbrowser",
    init: function () {
        console.log("init mcb");
        this.options = parser.parse(this.el, this.options);
        console.log("self.options: ", this.options);
        this.component_instance = new MillerColumnsBrowser({
            target: this.el,
            // hydrate: true,
            props: {
                maxDepth: this.options.maxDepth,
                vocabularyUrl: this.options.vocabularyUrl,
            },
        });
    },
});
