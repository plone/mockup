import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

// Thin registration module: the implementation (incl. the XML templates and
// the Modal dependency) is loaded lazily on first match, so it stays out of
// the eager patterns chunk on pages without a recurrence widget.
export default Base.extend({
    name: "recurrence",
    trigger: ".pat-recurrence",
    parser: "mockup",

    init: async function () {
        const impl = (await import("./recurrence--implementation")).default;
        // The options were parsed against empty defaults — the defaults live
        // with the implementation. Merge them in now, keeping parsed values.
        this.options = $.extend(true, {}, impl.defaults, this.options);
        // Graft the implementation onto this instance and run its init.
        $.extend(this, impl);
        return impl.init.apply(this, arguments);
    },
});
