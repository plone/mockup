import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import _t from "../../core/i18n-wrapper";

export default Base.extend({
    name: "formunloadalert",
    trigger: ".pat-formunloadalert",
    parser: "mockup",
    _changed: false, // Stores a listing of raised changes by their key
    _suppressed: false, // whether or not warning should be suppressed
    defaults: {
        message: _t(
            "Discard changes? If you click OK, " +
                "any changes you have made will be lost."
        ),
        // events on which to check for changes
        changingEvents: "change keyup paste",
        // fields on which to check for changes
        changingFields: "input,select,textarea,fileupload",
    },
    init() {
        var self = this;
        // if this is not a form just return
        if (!self.$el.is("form")) {
            return;
        }

        $(self.options.changingFields, self.$el).on(
            self.options.changingEvents,
            (evt) => {
                self._changed = true;
            }
        );

        var $modal = self.$el.parents(".plone-modal");
        if ($modal.length !== 0) {
            $modal.on("hide", function (e) {
                var modal = $modal.data("patternPloneModal");
                if (modal) {
                    modal._suppressHide = self._handleUnload.call(self, e);
                }
            });
        } else {
            $(window).on("beforeunload", (e) => {
                return self._handleUnload(e);
            });
        }

        self.$el.on("submit", (e) => {
            self._suppressed = true;
        });
    },
    _handleUnload(e) {
        var self = this;
        if (self._suppressed) {
            self._suppressed = false;
            return undefined;
        }
        if (self._changed) {
            var msg = self.options.message;
            self._handleMsg(e, msg);
            $(window).trigger("messageset");
            return msg;
        }
    },
    _handleMsg(e, msg) {
        (e || window.event).returnValue = msg;
    },
});
