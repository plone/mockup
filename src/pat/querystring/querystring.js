import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

// Thin registration module: the widget implementation (incl. the eager edge
// into pat-contentbrowser) is loaded lazily on first match, so it stays out of
// the eager patterns chunk on pages without a querystring widget.
export default Base.extend({
    name: "querystring",
    trigger: ".pat-querystring",
    parser: "mockup",

    init: async function () {
        const impl = (await import("./querystring--implementation")).default;
        // Defaults live with the implementation; merge them under the parsed
        // options (which must win), reproducing the eager pattern's options.
        this.options = $.extend(true, {}, impl.defaults, this.options);
        // Graft the implementation's methods/state onto this single instance so
        // external consumers (e.g. pat-structure's textfilter, which reads
        // this.queryString.$sortOn) keep working against one object.
        $.extend(this, impl);
        return impl.init.apply(this, arguments);
    },
});
