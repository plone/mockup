import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import events from "@patternslib/patternslib/src/core/events";

let instance_counter = 0;

export default Base.extend({
    name: "backdrop",
    trigger: ".pat-backdrop",
    parser: "mockup",
    defaults: {
        zIndex: null,
        opacity: 0.8,
        className: "plone-backdrop",
        classActiveName: "plone-backdrop-active",
        closeOnEsc: true,
        closeOnClick: true,
    },
    init: function () {
        var self = this;
        self.$backdrop = $("> ." + self.options.className, self.$el);
        if (self.$backdrop.length === 0) {
            self.$backdrop = $("<div/>")
                .hide()
                .appendTo(self.$el)
                .addClass(self.options.className);
            if (self.options.zIndex !== null) {
                self.$backdrop.css("z-index", self.options.zIndex);
            }
        }
        // Per-instance id prefix for listeners. Calling init again must not
        // add another set of listeners.
        if (self._event_ns === undefined) {
            instance_counter += 1;
            self._event_ns = `backdrop-${instance_counter}`;
        }
        self.destroy();
        const is_active = () => self.el.classList.contains(self.options.classActiveName);
        if (self.options.closeOnEsc === true) {
            // The document outlives the backdrop, so the listener is
            // registered for removal in destroy().
            events.add_event_listener(
                document,
                "keydown",
                `${self._event_ns}--keydown`,
                (e) => {
                    if (e.key === "Escape" && is_active()) {
                        self.hide();
                    }
                },
            );
        }
        if (self.options.closeOnClick === true) {
            // A plain listener: it must not keep the backdrop element alive
            // when the element is removed without destroy().
            self._abort_controller = new AbortController();
            self.$backdrop[0].addEventListener(
                "click",
                () => {
                    if (is_active()) {
                        self.hide();
                    }
                },
                { signal: self._abort_controller.signal },
            );
        }
    },
    destroy: function () {
        // Remove the listeners of this instance. Does not hide the backdrop.
        events.remove_event_listener(document, `${this._event_ns}--*`);
        this._abort_controller?.abort();
        this._abort_controller = undefined;
    },
    show: function () {
        var self = this;
        if (!self.$el.hasClass(self.options.classActiveName)) {
            self.emit("show");
            self.$backdrop.css("opacity", "0").show();
            self.$el.addClass(self.options.classActiveName);
            self.$backdrop.animate({ opacity: self.options.opacity }, 500);
            self.emit("shown");
        }
    },
    hide: function () {
        var self = this;
        if (self.$el.hasClass(self.options.classActiveName)) {
            self.emit("hide");
            self.$backdrop.animate({ opacity: "0" }, 500).hide();
            self.$el.removeClass(self.options.classActiveName);
            self.emit("hidden");
        }
    },
});
