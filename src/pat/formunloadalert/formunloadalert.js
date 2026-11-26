import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import events from "@patternslib/patternslib/src/core/events";
import _t from "../../core/i18n-wrapper";

let instance_counter = 0;

export default Base.extend({
    name: "formunloadalert",
    trigger: ".pat-formunloadalert",
    parser: "mockup",
    _changed: false, // Stores a listing of raised changes by their key
    _suppressed: false, // whether or not warning should be suppressed
    defaults: {
        message: _t("Discard changes? If you click OK, any changes you have made will be lost."), // prettier-ignore
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

        $(self.options.changingFields, self.$el).on(self.options.changingEvents, () => {
            self._changed = true;
        });

        // Ask before a pat-plone-modal with this form is closed. See ADR 0007.
        const modal_el = self.el.closest(".modal");
        if (modal_el) {
            modal_el.addEventListener("plone-modal-before-hide", (e) => {
                const message = self._unsaved_message();
                if (message && !window.confirm(message)) {
                    e.preventDefault();
                }
            });
        }

        // The window outlives the form. The listener removes itself once the
        // form is not in the document anymore, e.g. after its modal closed.
        instance_counter += 1;
        const listener_id = `formunloadalert-${instance_counter}--beforeunload`;
        events.add_event_listener(window, "beforeunload", listener_id, (e) => {
            if (!self.el.isConnected) {
                events.remove_event_listener(window, listener_id);
                return;
            }
            self._handleUnload(e);
        });

        self.$el.on("submit", () => {
            self._suppressed = true;
        });
        // A failed submit in a pat-plone-modal saved nothing.
        self.el.addEventListener("plone-modal-submit-failed", () => {
            self._suppressed = false;
        });
    },
    _unsaved_message() {
        // The message to warn with, or undefined. A submit suppresses the
        // warning once.
        if (this._suppressed) {
            this._suppressed = false;
            return undefined;
        }
        if (this._changed) {
            return this.options.message;
        }
    },
    _handleUnload(e) {
        const msg = this._unsaved_message();
        if (msg) {
            this._handleMsg(e, msg);
            $(window).trigger("messageset");
        }
        return msg;
    },
    _handleMsg(e, msg) {
        const event = e || window.event;
        // A native beforeunload listener must call preventDefault to make the
        // browser ask. returnValue is for older browsers.
        event?.preventDefault?.();
        if (event) {
            event.returnValue = msg;
        }
    },
});
