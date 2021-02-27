import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "patternslib/src/core/base";

export default Base.extend({
    name: "recurrence",
    trigger: ".pat-recurrence",
    parser: "mockup",
    defaults: {
        // just passed onto the widget
        language: "en",
        localization: null,
        configuration: {},
    },
    init: async function () {
        // tmpl BEFORE recurrenceinput
        import("jquery.recurrenceinput.js/lib/jquery.tools.dateinput.css");
        import("jquery.recurrenceinput.js/lib/jquery.tools.overlay.css");
        import("jquery.recurrenceinput.js/src/jquery.recurrenceinput.css");
        await import("jquery.recurrenceinput.js/lib/jquery.tools.dateinput");
        await import("jquery.recurrenceinput.js/lib/jquery.tools.overlay");
        await import("jquery.recurrenceinput.js/lib/jquery.tmpl");
        await import("jquery.recurrenceinput.js/src/jquery.recurrenceinput");

        this.$el.addClass("recurrence-widget");
        if (this.options.localization) {
            $.tools.recurrenceinput.localize(
                this.options.language,
                this.options.localization
            );
        }
        $(this.el).recurrenceinput(this.options.configuration);
    },
});
