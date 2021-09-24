import $ from "jquery";
import _t from "../../core/i18n-wrapper";
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "preventdoublesubmit",
    trigger: ".pat-preventdoublesubmit",
    parser: "mockup",
    defaults: {
        message: _t(
            "You already clicked the submit button. " +
                "Do you really want to submit this form again?"
        ),
        guardClassName: "submitting",
        optOutClassName: "allowMultiSubmit",
    },
    init() {
        var self = this;

        // if this is not a form just return
        if (!self.$el.is("form")) {
            return;
        }

        $(":submit", self.$el).click(function () {
            // mark the button as clicked
            $(":submit").removeAttr("clicked");
            $(this).attr("clicked", "clicked");

            // if submitting and no opt-out guardClassName is found
            // pop up confirmation dialog
            if (
                $(this).hasClass(self.options.guardClassName) &&
                !$(this).hasClass(self.options.optOutClassName)
            ) {
                return self._confirm.call(self);
            }

            $(this).addClass(self.options.guardClassName);
        });
    },

    _confirm() {
        return window.confirm(this.options.message);
    },
});
