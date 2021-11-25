import registry from "@patternslib/patternslib/src/core/registry";
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "registry",
    trigger: ".pat-registry",
    parser: "mockup",
    init: async function () {
        var self = this;
        const implementation = (await import("./registry--implementation.js")).default;
        const reg = new implementation(this.el);
        reg.init();
    },
});
