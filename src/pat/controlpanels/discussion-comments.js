import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "discussion-comments",
    trigger: ".pat-discussion",

    async init() {
        // Async import implementation to reduce bundle size for controlpanels
        const implementation = (
            await import("./discussion-comments--implementation")
        ).default;
        const instance = new implementation(this.el);
        instance.init();
    },
});
