import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "patternslib/src/core/base";

export default Base.extend({
    name: "contentbrowser",
    trigger: ".pat-contentbrowser",
    parser: "mockup",

    async init() {
        // let volto = await import("@plone/volto");
        this.el.style["background-color"] = "green";
    },
});
