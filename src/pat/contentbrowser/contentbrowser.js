import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "contentbrowser",
    trigger: ".pat-contentbrowser",
    parser: "mockup",

    async init() {
        let contentbrowser = await import("@plone/volto/components/manage/Contents/Contents.jsx"); // prettier-ignore

        this.el.style["background-color"] = "green";
    },
});
