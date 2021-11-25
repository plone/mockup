import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "dexterity-types-listing",
    trigger: "form[action$='@@dexterity-types']",

    async init() {
        // Async import implementation to reduce bundle size for controlpanels
        const implementation = (
            await import("./dexterity-types-listing--implementation")
        ).default;
        implementation(this.el);
    },
});
