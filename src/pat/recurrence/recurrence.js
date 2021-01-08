import $ from "jquery";
import Base from "patternslib/src/core/base";

// tmpl BEFORE recurrenceinput
import "jquery.recurrenceinput.js/lib/jquery.tools.dateinput";
import "jquery.recurrenceinput.js/lib/jquery.tools.overlay";
import "jquery.recurrenceinput.js/lib/jquery.tmpl";
import "jquery.recurrenceinput.js/src/jquery.recurrenceinput";

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
    init: function () {
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
