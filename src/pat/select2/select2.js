import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

// Thin registration module: the select2 wrapper, the select2 library, and the
// select2_locale_* context are loaded lazily on first match, so they stay out
// of the eager patterns chunk on pages without a select2 widget.
export default Base.extend({
    name: "select2",
    trigger: ".pat-select2",
    parser: "mockup",

    init: async function () {
        const impl = (await import("./select2--implementation")).default;
        // Defaults live with the implementation; merge them under the parsed
        // options (which must win), reproducing the eager pattern's options.
        this.options = $.extend(true, {}, impl.defaults, this.options);
        // Graft onto this single instance so the pattern registers and behaves
        // exactly as before, just with the heavy body loaded on demand.
        $.extend(this, impl);
        return impl.init.apply(this, arguments);
    },
});
