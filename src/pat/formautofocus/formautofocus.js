import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "formautofocus",
    trigger: ".pat-formautofocus",
    parser: "mockup",
    defaults: {
        condition: "div.error",
        target: "div.error :input:not(.formTabs):visible:first",
        always: ":input:not(.formTabs):visible:first",
    },
    init() {
        if ($(this.options.condition, this.$el).length !== 0) {
            $(this.options.target, this.$el).focus();
        } else {
            $(this.options.always, this.$el).focus();
        }
    },
});
