import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

// Thin registration module: the upload implementation (jquery/underscore/i18n
// wiring plus the lazily-loaded Dropzone integration) is loaded on first match,
// so it stays out of the eager patterns chunk on pages without an upload widget.
export default Base.extend({
    name: "upload",
    trigger: ".pat-upload",
    parser: "mockup",

    init: async function () {
        // The implementation is a full Base.extend pattern (imperative callers
        // do `new Upload(...)`), so its instance behaviour lives on the
        // prototype.
        const proto = (await import("./upload--implementation")).default.prototype;
        // Defaults live with the implementation; merge them under the parsed
        // options (which must win), reproducing the eager pattern's options.
        this.options = $.extend(true, {}, proto.defaults, this.options);
        // Graft onto this single instance so the pattern registers and behaves
        // exactly as before, just with the heavy body loaded on demand.
        $.extend(this, proto);
        return proto.init.apply(this, arguments);
    },
});
