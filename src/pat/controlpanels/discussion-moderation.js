import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "discussion-moderation",
    trigger: "#fieldset-moderate-comments",

    async init() {
        // Async import implementation to reduce bundle size for controlpanels
        const implementation = (
            await import("./discussion-moderation--implementation")
        ).default;
        const instance = new implementation(this.el);
        instance.init();
    },
});
