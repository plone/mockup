import "regenerator-runtime/runtime"; // needed for ``await`` support
import registry from "@patternslib/patternslib/src/core/registry";
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "schemaeditor",
    trigger: ".pat-schemaeditor",
    parser: "mockup",
    init: async function () {
        const implementation = (await import("./schemaeditor--implementation")).default;
        const instance = new implementation(this.el);
        instance.init();
    },
});
