import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

// Thin registration module: the implementation (incl. the templates, the
// bootstrap dropdown and the borrowed select2 methods) is loaded lazily on
// first match, so it stays out of the eager patterns chunk on pages without a
// related-items widget.
export default Base.extend({
    name: "relateditems",
    trigger: ".pat-relateditems",
    parser: "mockup",

    init: async function () {
        const impl = (await import("./relateditems--implementation")).default;
        // Defaults live with the implementation; merge them under the parsed
        // options (which must win), reproducing the eager pattern's options.
        this.options = $.extend(true, {}, impl.defaults, this.options);
        // Graft onto this single instance so the pattern registers and behaves
        // exactly as before, just with the heavy body loaded on demand.
        $.extend(this, impl);
        return impl.init.apply(this, arguments);
    },
});
