import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "contentrules-elements",
    trigger: "pat-contentrules-elements",

    async init() {
        // Async import implementation to reduce bundle size for controlpanels
        const implementation = (
            await import("./contentrule-elements--implementation")
        ).default;
        const instance = new implementation(this.el);
        instance.init();
    },
});
