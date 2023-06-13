import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

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
        if (self.options.closeOnEsc === true) {
            // eslint-disable-next-line no-unused-vars
            $(document).on("keydown", function (e, data) {
                if (self.$el.is("." + self.options.classActiveName)) {
                    if (e.keyCode === 27) {
                        // ESC key pressed
                        self.hide();
                    }
                }
            });
        }
        if (self.options.closeOnClick === true) {
            self.$backdrop.on("click", function () {
                if (self.$el.is("." + self.options.classActiveName)) {
                    self.hide();
                }
            });
        }
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
