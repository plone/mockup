import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

// Thin registration module: the ~1000-line modal implementation (incl. the
// Backdrop wiring, templating and the lazy jquery-form dependency) is loaded
// on first match, so it stays out of the eager patterns chunk on pages
// without a modal. Imperative callers that need the class directly import
// ./modal--implementation instead.
export default Base.extend({
    name: "plone-modal",
    trigger: ".pat-plone-modal",
    parser: "mockup",

    init: async function () {
        // The implementation is a full Base.extend pattern (imperative callers
        // do `new Modal(...)`), so its instance behaviour lives on the
        // prototype — `Impl.init` would be the static registry initialiser.
        const proto = (await import("./modal--implementation")).default.prototype;
        // Defaults live with the implementation; merge them under the parsed
        // options (which must win), reproducing the eager pattern's options.
        this.options = $.extend(true, {}, proto.defaults, this.options);
        // Graft onto this single instance so the pattern registers and behaves
        // exactly as before, just with the heavy body loaded on demand.
        $.extend(this, proto);
        return proto.init.apply(this, arguments);
    },
});
